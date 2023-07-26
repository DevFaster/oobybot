/*！
 * @file oobybot/main.ts
 * @brief i2form Oobybot micro:bit makecode extension.
 *
 * @copyright	[i2form](https://www.i2form-sasu.com), 2023
 */

enum Version {
    //% block="servomoteurs"
    Servo = 1,
    //% block="moteurs CC"
    DCMotor = 2
}

enum Movement {
    //% block="avancer"
    Forward = -1,
    //% block="reculer"
    Backward = 1
}

enum Side {
    //% block="droite"
    Right = -1,
    //% block="gauche"
    Left = 1
}

enum State {
    //% block="bas"
    Low = 0,
    //% block="haut"
    High = 1
}

enum DistanceUnit {
    //% block="cm"
    CM,
    //% block="inch",
    INCH
}

/**
 * Oobybot functions
 */
//% weight=100 color=#af5200 icon="\uf188"
namespace Oobybot {
    const servoSpeed = 130 // trs/min
    const dcSpeed = 200 // trs/min
    const wheelDistance = 12 // cm
    const wheelRadius = 2.5 // cm
    const servoConstants = [88, 0.3]

    let ledPin = DigitalPin.P0
    let servoRightPin = AnalogPin.P1
    let servoLeftPin = AnalogPin.P2
    let dcRightForwardPin = servoRightPin
    let dcLeftForwardPin = servoLeftPin
    let dcRightBackwardPin = AnalogPin.P3
    let dcLeftBackwardPin = AnalogPin.P4
    let ultrasonicTriggerPin = DigitalPin.P8
    let ultrasonicEchoPin = DigitalPin.P16
    let lineFollowerRightPin = DigitalPin.P5
    let lineFollowerLeftPin = DigitalPin.P6

    let blink = false
    let blinkDelay = 1000
    let follow = false

    let version = 0

    function blinkLED(): void {
        while (blink) {
            pins.digitalWritePin(ledPin, 1)
            basic.pause(blinkDelay)
            pins.digitalWritePin(ledPin, 0)
            basic.pause(blinkDelay)
        }
    }

    basic.forever(blinkLED)

    function lineFollow(): void {
        while (follow) {
            if (!lineFollowerState(Side.Left) && !lineFollowerState(Side.Right)) {
                move(Movement.Forward, 50)
            }
            if (!lineFollowerState(Side.Left) && lineFollowerState(Side.Right)) {
                moveControl(Side.Left, Movement.Forward, 30)
                while (lineFollowerState(Side.Right)) {
                    basic.pause(1)
                }
                move(Movement.Forward, 50)
            }
            if (lineFollowerState(Side.Left) && !lineFollowerState(Side.Right)) {
                moveControl(Side.Right, Movement.Forward, 30)
                while (lineFollowerState(Side.Left)) {
                    basic.pause(1)
                }
                move(Movement.Forward, 50)
            }
            if (!lineFollowerState(Side.Left) && !lineFollowerState(Side.Right)) {
                moveStop()
                follow = false
            }
        }
    }

    basic.forever(lineFollow)

    function stop(): void {
        follow = false
        blink = false
        basic.showIcon(IconNames.No)
        while (true) {
            basic.pause(1)
        }
    }

    function checkInit(config: Version = 0): void {
        if (config == 0) {
            if (version != Version.Servo && version != Version.DCMotor) {
                stop()
            }
        } else {
            if (version != config) {
                stop()
            }
        }
    }

    /**
     * Initialiser le robot Oobybot et ses capteurs
     * @param config La version du robot (avec servomoteurs ou moteurs CC)
     */
    //% block="initialiser l'Oobybot avec des $config"
    export function init(config: Version): void {
        version = config
        if (version == Version.Servo) {
            changeServoPin(Side.Right, servoRightPin)
            changeServoPin(Side.Left, servoLeftPin)
        } else {
            changeDcPins(Side.Right, dcRightForwardPin, dcRightBackwardPin)
            changeDcPins(Side.Left, dcLeftForwardPin, dcLeftBackwardPin)
        }
    }

    /**
     * Permet de contrôler les LED du robot Oobybot
     * @param state L'état désiré des LED du robot
     */
    //% block="contrôler LED à l'état $state"
    //% group="LED"
    export function ledControl(state: State): void {
        blink = false
        pins.digitalWritePin(ledPin, state)
    }

    /**
     * Permet de faire clignoter les LED du robot Oobybot
     * @param delay Délai entre chaque clignotement des LED du robot (en ms)
     */
    //% block="clignoter LED délai $delay ms"
    //% group="LED"
    //% delay.shadow=timePicker
    export function ledBlink(delay: number): void {
        blink = true
        blinkDelay = delay
    }

    /**
     * Éteint les LED du robot Oobybot
     */
    //% block="éteindre LED"
    //% group="LED"
    export function ledStop(): void {
        blink = false
    }

    /**
     * Changer la broche commandant les LED du robot Oobybot
     * @param pin La broche de commande associée aux LED
     */
    //% block="changer broche LED pour $pin"
    //% group="Configuration"
    export function changeLedPin(pin: DigitalPin): void {
        ledPin = pin
    }

    /**
     * Changer la broche commandant le servomoteur droit ou gauche du robot (ne sert à rien si le robot est défini sur les moteurs CC)
     * @param side Le servomoteur continu du côté droit ou gauche
     * @param pin La broche de commande associée au servomoteur (droit / gauche)
     */
    //% block="changer broche servo de $side pour $pin"
    //% group="Configuration"
    export function changeServoPin(side: Side, pin: AnalogPin): void {
        checkInit(Version.Servo)
        if (side == Side.Right) {
            servoRightPin = pin
            pins.servoSetPulse(servoRightPin, 20000)
            pins.servoSetContinuous(servoRightPin, true)
        } else {
            servoLeftPin = pin
            pins.servoSetPulse(servoLeftPin, 20000)
            pins.servoSetContinuous(servoLeftPin, true)
        }
    }

    /**
     * Changer la broche commandant le moteurs CC droit ou gauche du robot (ne sert à rien si le robot est défini sur les servomoteurs)
     * @param side Le moteur CC du côté droit ou gauche
     * @param forwardPin La broche de commande associée au sens avant du moteur CC droit ou gauche
     * @param backwardPin La broche de commande associée au sens arrière du moteur CC droit ou gauche
     */
    //% block="changer broches moteur CC de $side broche avant $forwardPin broche arrière $backwardPin"
    //% group="Configuration"
    export function changeDcPins(side: Side, forwardPin: AnalogPin, backwardPin: AnalogPin): void {
        checkInit(Version.DCMotor)
        if (side == Side.Right) {
            dcRightForwardPin = forwardPin
            dcRightBackwardPin = backwardPin
        } else {
            dcLeftForwardPin = forwardPin
            dcLeftBackwardPin = backwardPin
        }
    }

    /**
     * Changer les broche commandant le capteur ultrason du robot Oobybot
     * @param triggerPin La broche associée à la commande d'émission du capteur ultrason
     * @param echoPin La broche associée à la commande de réception du capteur ultrason
     */
    //% block="changer broches capteur ultrason pour trig $triggerPin echo $echoPin"
    //% group="Configuration"
    export function changeUltrasonicPins(triggerPin: DigitalPin, echoPin: DigitalPin): void {
        ultrasonicTriggerPin = triggerPin
        ultrasonicEchoPin = echoPin
    }

    /**
     * Changer la broche commandant le capteur suiveur de ligne droit ou gauche du robot Oobybot
     * @param side Le capteur suiveur de ligne du côté droit ou gauche
     * @param pin La broche de commande associée au capteur suiveur de ligne
     */
    //% block="changer broche capteur suiveur de ligne de $side pour $pin"
    //% group="Configuration"
    export function changeLineFollowerPin(side: Side, pin: DigitalPin): void {
        if (side == Side.Right) {
            lineFollowerRightPin = pin
        } else {
            lineFollowerLeftPin = pin
        }
    }

    function servoMove(direction: Movement, speed: number): void {
        pins.servoWritePin(servoRightPin, servoConstants[0] + direction * speed * servoConstants[1])
        pins.servoWritePin(servoLeftPin, servoConstants[0] - direction * speed * servoConstants[1])
    }

    function servoRotate(side: Side, speed: number): void {
        pins.servoWritePin(servoRightPin, servoConstants[0] + side * speed * servoConstants[1])
        pins.servoWritePin(servoLeftPin, servoConstants[0] + side * speed * servoConstants[1])
    }

    export function servoStop(): void {
        pins.servoWritePin(servoRightPin, servoConstants[0])
        pins.servoWritePin(servoLeftPin, servoConstants[0])
    }

    function servoControl(side: Side, direction: Movement, speed: number): void {
        if (side == Side.Right) {
            pins.servoWritePin(servoRightPin, servoConstants[0] + direction * speed * servoConstants[1])
        } else {
            pins.servoWritePin(servoLeftPin, servoConstants[0] - direction * speed * servoConstants[1])
        }
    }

    function dcMove(direction: Movement, speed: number): void {
        if (direction == Movement.Forward) {
            pins.analogWritePin(dcRightForwardPin, speed * 10.23)
            pins.analogWritePin(dcLeftBackwardPin, speed * 10.23)
        } else {
            pins.analogWritePin(dcRightBackwardPin, speed * 10.23)
            pins.analogWritePin(dcLeftForwardPin, speed * 10.23)
        }
    }

    function dcRotate(side: Side, speed: number): void {
        if (side == Side.Left) {
            pins.analogWritePin(dcRightForwardPin, speed * 10.23)
            pins.analogWritePin(dcLeftForwardPin, speed * 10.23)
        } else {
            pins.analogWritePin(dcRightBackwardPin, speed * 10.23)
            pins.analogWritePin(dcLeftBackwardPin, speed * 10.23)
        }
    }

    function dcStop(): void {
        pins.analogWritePin(dcRightForwardPin, 0)
        pins.analogWritePin(dcLeftBackwardPin, 0)
    }

    export function dcControl(side: Side, direction: Movement, speed: number): void {
        if (side == Side.Right) {
            if (direction == Movement.Forward) {
                pins.analogWritePin(dcRightForwardPin, speed * 10.23)
            } else {
                pins.analogWritePin(dcRightBackwardPin, speed * 10.23)
            }
        } else {
            if (direction == Movement.Forward) {
                pins.analogWritePin(dcLeftForwardPin, speed * 10.23)
            } else {
                pins.analogWritePin(dcLeftBackwardPin, speed * 10.23)
            }
        }
    }

    /**
     * Permet de contrôler la direction (avant / arrière) ainsi que la vitesse (de 0 à 100%) du robot Oobybot
     * @param direction La direction du mouvement
     * @param speed La vitesse des moteurs
     */
    //% block="faire $direction le robot à la vitesse $speed \\%"
    //% subcategory="Mouvement"
    //% group="Mouvement basique"
    //% speed.min=0 speed.max=100
    //% speed.fieldOptions.precision=1
    export function move(direction: Movement, speed: number): void {
        checkInit()
        if (version == Version.Servo) {
            servoMove(direction, speed)
        } else {
            dcMove(direction, speed)
        }
    }

    /**
     * Permet de contrôler la direction (avant / arrière) ainsi que la distance que le robot Oobybot parcours
     * @param direction La direction du mouvement
     * @param distance La distance de parcours
     * @param unit L'unité de la distance à parcourir
     */
    //% block="faire $direction le robot sur $distance $unit"
    //% subcategory="Mouvement"
    //% group="Mouvement basique"
    //% distance.min=0 distance.max=200
    //% distance.fieldOptions.precision=1
    export function moveDistance(direction: Movement, distance: number, unit: DistanceUnit): void {
        checkInit()
        if (unit == DistanceUnit.INCH) {
            distance *= 2.54
        }
        if (version == Version.Servo) {
            servoMove(direction, 100)
            basic.pause(distance / (servoSpeed * Math.PI * 2 * wheelRadius))
            servoStop()
        } else {
            dcMove(direction, 100)
            basic.pause(distance / (dcSpeed * Math.PI * 2 * wheelRadius))
            dcStop()
        }
    }

    /**
     * Permet de contrôler la direction (droite / gauche) ainsi que la vitesse (de 0 à 100%) du robot Oobybot
     * @param side La direction de rotation
     * @param speed La vitesse des moteurs
     */
    //% block="tourner à %side à la vitesse %speed \\%"
    //% subcategory="Mouvement"
    //% group="Mouvement basique"
    //% speed.min=0 speed.max=100
    //% speed.fieldOptions.precision=1
    export function rotate(side: Side, speed: number): void {
        checkInit()
        if (version == Version.Servo) {
            servoRotate(side, speed)
        } else {
            dcRotate(side, speed)
        }
    }

    /**
     * Permet de tourner le robot sur lui même d'un certain angle selon une direction (droite / gauche)
     * @param side La direction de rotation
     * @param angle L'angle de rotation
     */
    //% block="tourner à $side d'un angle de $angle °"
    //% subcategory="Mouvement"
    //% group="Mouvement basique"
    //% angle.min=0 angle.max=360
    //% angle.fieldOptions.precision=1
    export function rotateAngle(side: Side, angle: number): void {
        checkInit()
        if (version == Version.Servo) {
            servoRotate(side, 100)
            basic.pause(angle * wheelDistance / (180 * wheelRadius * servoSpeed))
            servoStop()
        } else {
            dcRotate(side, 100)
            basic.pause(angle * wheelDistance / (180 * wheelRadius * dcSpeed))
            dcStop()
        }
    }

    /**
     * Permet d'arrêter la course du robot Oobybot
     */
    //% block="arrêter la course du robot"
    //% subcategory="Mouvement"
    //% group="Mouvement basique"
    export function moveStop(): void {
        checkInit()
        if (version == Version.Servo) {
            servoStop()
        } else {
            dcStop()
        }
    }

    /**
     * Permet de contrôler un moteur (droit / gauche), sa direction (avant / arrière) et sa vitesse (de 0 à 100%) du robot Oobybot
     * @param side Le moteur droit ou gauche
     * @param direction Le sens de rotation du moteur (avant / arrière)
     * @param speed La vitesse de rotation du moteur
     */
    //% block="contrôler moteur de $side pour $direction à la vitesse $speed \\%"
    //% subcategory="Mouvement"
    //% group="Mouvement avancé"
    //% speed.min=0 speed.max=100
    //% speed.fieldOptions.precision=1
    export function moveControl(side: Side, direction: Movement, speed: number): void {
        checkInit()
        if (version == Version.Servo) {
            servoControl(side, direction, speed)
        } else {
            dcControl(side, direction, speed)
        }
    }

    /**
     * Renvoi la distance (en cm ou en pouce) entre un objet et le robot Oobybot grâce à son capteur ultrason
     * @param unit L'unité de mesure de la distance
     */
    //% block="distance $unit"
    //% subcategory="Capteurs"
    //% group="Capteur ultrason"
    export function ultrasonicDistance(unit: DistanceUnit): number {
        pins.digitalWritePin(ultrasonicTriggerPin, 1)
        basic.pause(1)
        pins.digitalWritePin(ultrasonicTriggerPin, 0)

        let startPulse, endPulse
        while (pins.digitalReadPin(ultrasonicEchoPin) == 0) {
            startPulse = input.runningTimeMicros()
        }
        while (pins.digitalReadPin(ultrasonicEchoPin) == 1) {
            endPulse = input.runningTimeMicros()
            if (endPulse - startPulse > 8824) {
                break
            }
        }

        if (unit == DistanceUnit.CM) {
            return Math.round(0.0034 * (endPulse - startPulse))
        }
        return Math.round(0.0034 * (endPulse - startPulse) / 2.54)
    }

    /**
     * Vérifie si le robot Oobybot est proche d'un objet
     * @param distance La distance à l'objet minimale
     * @param L'unité de mesure de la distance (cm / inch)
     */
    //% block="distance est inférieure à $distance $unit"
    //% subcategory="Capteurs"
    //% group="Capteur ultrason"
    //% distance.min=0 distance.max=300
    //% distance.fieldOptions.precision=1
    export function ultrasonicDistanceLessThan(distance: number, unit: DistanceUnit): boolean {
        return ultrasonicDistance(unit) <= distance
    }

    /**
     * Renvoi l'état du capteur suiveur de ligne (droit / gauche) du robot Oobybot (Vrai si noir détecté, Faux sinon)
     * @param side Le capteur suiveur de ligne droit ou gauche
     */
    //% block="état du capteur suiveur de ligne de $side"
    //% subcategory="Capteurs"
    //% group="Capteurs suiveurs de ligne"
    export function lineFollowerState(side: Side): boolean {
        if (side == Side.Right) {
            return pins.digitalReadPin(lineFollowerRightPin) == 1
        }
        return pins.digitalReadPin(lineFollowerLeftPin) == 1
    }

    /**
     * Permet de suivre la ligne (noire)
     */
    //% block="suivre la ligne"
    //% subcategory="Capteurs"
    //% group="Capteurs suiveurs de ligne"
    export function followLine(): void {
        follow = true
    }

    /**
     * Permet d'arrêter de suivre la ligne (noire)
     */
    //% block="arrêter de suivre la ligne"
    //% subcategory="Capteurs"
    //% group="Capteurs suiveurs de ligne"
    export function stopFollowLine(): void {
        follow = false
    }
}
