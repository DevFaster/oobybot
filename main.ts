const servoSpeed = 20 // trs/min
const dcSpeed = 30 // trs/min
const wheelDistance = 10 // cm
const wheelRadius = 2 // cm

let blink = false
let blinkDelay = 1000

enum Version {
    //% block="servomoteurs"
    Servo,
    //% block="moteurs CC"
    DCMotor,
    Undefined
}

enum Movement {
    //% block="avancer"
    Forward = 1,
    //% block="reculer"
    Backward = -1
}

enum Side {
    //% block="droite"
    Right = -1,
    //% block="gauche"
    Left = 1
}

enum SideM {
    //% block="droit"
    Right = -1,
    //% block="gauche"
    Left = 1
}

enum State {
    //% block="bas"
    Low,
    //% block="haut"
    High
}

enum DistanceUnit {
    //% block="cm"
    CM,
    //% block="inch",
    INCH
}

let version = Version.Undefined
let error = false

function blinkLED() {
    while (blink) {
        pins.digitalWritePin(DigitalPin.P0, 1)
        basic.pause(blinkDelay)
        pins.digitalWritePin(DigitalPin.P0, 0)
        basic.pause(blinkDelay)
    }
}

basic.forever(blinkLED)

/**
 * Custom blocks
 */
//% weight=100 color=#af5200 icon=""
namespace Oobybot {
    function checkInit(): void {
        if (!error) {
            if (version == Version.Undefined) {
                error = true
                control.reset()
            }
        } else {
            basic.showIcon(IconNames.No)
        }
    }

    /**
     * Initialiser le robot Oobybot et ses capteurs
     * @param _version La version du robot (avec servomoteurs ou moteurs CC)
     */
    //% block="initialiser l'Oobybot"
    export function init(_version: Version): void {
        version = _version
    }

    /**
     * Permet de contrôler les LED du robot Oobybot
     * @param state L'état des LED du robot
     */
    //% block="contrôler les LED à l'état $state"
    //% group="LED"
    export function ledControl(state: State): void {
        blink = false
        pins.digitalWritePin(DigitalPin.P0, state)
    }

    /**
     * Permet de faire clignoter les LED du robot Oobybot
     * @param delay Délai entre chaque clignotement des LED du robot (en ms)
     */
    //% block="clignoter LED délai $delay ms"
    //% group="LED"
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
    
    function servoMove(direction: Movement, speed: number): void {
        pins.servoWritePin(AnalogPin.P1, 90 + direction * speed * 0.9)
        pins.servoWritePin(AnalogPin.P2, 90 - direction * speed * 0.9)
    }

    function servoRotate(side: Side, speed: number): void {
        pins.servoWritePin(AnalogPin.P1, 90 + side * speed * 0.9)
        pins.servoWritePin(AnalogPin.P2, 90 + side * speed * 0.9)
    }

    function servoRotateAngle(side: Side, angle: number): void {
        servoRotate(side, 100)
        basic.pause(angle * wheelDistance / (360 * wheelRadius * servoSpeed))
        servoStop()
    }

    export function servoStop(): void {
        pins.servoWritePin(AnalogPin.P1, 90)
        pins.servoWritePin(AnalogPin.P2, 90)
    }

    function servoControl(side: SideM, direction: Movement, speed: number): void {
        if (side == SideM.Right) {
            pins.servoWritePin(AnalogPin.P1, 90 + direction * speed * 0.9)
        } else {
            pins.servoWritePin(AnalogPin.P2, 90 - direction * speed * 0.9)
        }
    }
    
    function dcMove(direction: Movement, speed: number): void {
        if (direction == Movement.Forward) {
            pins.analogWritePin(AnalogPin.P1, speed * 10.23)
            pins.analogWritePin(AnalogPin.P4, speed * 10.23)
        } else {
            pins.analogWritePin(AnalogPin.P3, speed * 10.23)
            pins.analogWritePin(AnalogPin.P2, speed * 10.23)
        }
    }

    function dcRotate(side: Side, speed: number): void {
        if (side == Side.Left) {
            pins.analogWritePin(AnalogPin.P1, speed * 10.23)
            pins.analogWritePin(AnalogPin.P2, speed * 10.23)
        } else {
            pins.analogWritePin(AnalogPin.P3, speed * 10.23)
            pins.analogWritePin(AnalogPin.P4, speed * 10.23)
        }
    }

    function dcRotateAngle(side: Side, angle: number): void {
        dcRotate(side, 100)
        basic.pause(angle * wheelDistance / (360 * wheelRadius * dcSpeed))
        dcStop()
    }

    function dcStop(): void {
        pins.analogWritePin(AnalogPin.P1, 0)
        pins.analogWritePin(AnalogPin.P4, 0)
    }

    export function dcControl(side: SideM, direction: Movement, speed: number): void {
        if (side == SideM.Right) {
            if (direction == Movement.Forward) {
                pins.analogWritePin(AnalogPin.P1, speed * 10.23)
            } else {
                pins.analogWritePin(AnalogPin.P3, speed * 10.23)
            }
        } else {
            if (direction == Movement.Forward) {
                pins.analogWritePin(AnalogPin.P2, speed * 10.23)
            } else {
                pins.analogWritePin(AnalogPin.P4, speed * 10.23)
            }
        }
    }

    /**
     * Permet de contrôler la direction (avant / arrière) ainsi que la vitesse (de 0 à 100%) du robot Oobybot
     * @param direction La direction du mouvement
     * @param speed La vitesse des moteurs
     */
    //% block="$direction à la vitesse de $speed %"
    //% subcategory="Mouvement"
    //% group="Mouvement basique"
    export function move(direction: Movement, speed: number): void {
        checkInit()
        if (version == Version.Servo) {
            servoMove(direction, speed)
        } else {
            dcMove(direction, speed)
        }
    }

    /**
     * Permet de contrôler la direction (droite / gauche) ainsi que la vitesse (de 0 à 100%) du robot Oobybot
     * @param side La direction de rotation
     * @param speed La vitesse des moteurs
     */
    //% block="tourner à %side à la vitesse de %speed %"
    //% subcategory="Mouvement"
    //% group="Mouvement basique"
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
    export function rotateAngle(side: Side, angle: number): void {
        checkInit()
        if (version == Version.Servo) {
            servoRotateAngle(side, angle)
        } else {
            dcRotateAngle(side, angle)
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
     * @param  direction Le sens de rotation du moteur (avant / arrière)
     * @param speed La vitesse de rotation du moteur
     */
    //% block="contrôler le moteur $side pour $direction à la vitesse de $speed %"
    //% subcategory="Mouvement"
    //% group="Mouvement avancé"
    export function moveControl(side: SideM, direction: Movement, speed: number): void {
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
    //% group="Capteurs"
    export function ultrasonicDistance(unit: DistanceUnit): number {
        pins.digitalWritePin(DigitalPin.P8, 1)
        basic.pause(1)
        pins.digitalWritePin(DigitalPin.P8, 0)

        let startImpulsion = 0
        let endImpulsion = 0
        while (pins.digitalReadPin(DigitalPin.P16) == 0) {
            startImpulsion = input.runningTimeMicros()
        }
        while (pins.digitalReadPin(DigitalPin.P16) == 1) {
            endImpulsion = input.runningTimeMicros()
            if (endImpulsion - startImpulsion > 8824) {
                break
            }
        }
        
        if (unit == DistanceUnit.CM) {
            return Math.round((endImpulsion - startImpulsion) * 0.17)
        }
        return Math.round((endImpulsion - startImpulsion) * 0.067)
    }

    /**
     * Vérifie si le robot Oobybot est proche d'un objet
     * @param distance La distance à l'objet minimale
     * @param L'unité de mesure de la distance (cm / inch)
     */
    //% block="distance est inférieure à $distance $unit"
    //% group="Capteurs"
    export function ultrasonicDistanceLessThan(distance: number, unit: DistanceUnit): boolean {
        return ultrasonicDistance(unit) <= distance
    }

    /**
     * Renvoi l'état du capteur suiveur de ligne (droit / gauche) du robot Oobybot (Vrai si noir détecté, Faux sinon)
     * @param side Le capteur suiveur de ligne droit ou gauche
     */
    //% block="état capteur suiveur de ligne $side"
    //% group="Capteurs"
    export function lineFollowerState(side: SideM): boolean {
        if (side == SideM.Right) {
            return pins.digitalReadPin(DigitalPin.P5) == 1
        }
        return pins.digitalReadPin(DigitalPin.P6) == 1
    }
}
