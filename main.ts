let blink = false
let blinkDelay = 1000

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

enum State {
    //% block="bas"
    Low,
    //% block="haut"
    High
}

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
    /**
     * Initialiser le robot Oobybot et ses capteurs
     */
    //% block="initialiser l'Oobybot"
    export function init(): void {
        makerbit.connectUltrasonicDistanceSensor(DigitalPin.P5, DigitalPin.P8)
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
     * @param delay Délai entre chaque clignotement des LED du robot
     */
    //% block="clignoter LED délai $delay"
    //% group="LED"
    export function ledBlink(delay: number): void {
        blink = true
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
     * Permet de contrôler la direction (avant / arrière) ainsi que la vitesse (de 0 à 100%) des servomoteurs continus du robot Oobybot
     * @param direction La direction du mouvement
     * @param speed La vitesse des moteurs
     */
    //% block="[Servo] contrôler le robot $direction vitesse $speed %"
    //% subcategory="Servomoteurs"
    //% group="Mouvement basique"
    export function servoMove(direction: Movement, speed: number): void {
        pins.servoWritePin(AnalogPin.P1, 90 + direction * speed * 0.9)
        pins.servoWritePin(AnalogPin.P2, 90 - direction * speed * 0.9)
    }

    /**
     * Permet de contrôler la direction (droite / gauche) ainsi que la vitesse (de 0 à 100%) des servomoteurs continus du robot Oobybot
     * @param side La direction de rotation
     * @param speed La vitesse des moteurs
     */
    //% block="[Servo] pivoter vers la %side vitesse %speed %"
    //% subcategory="Servomoteurs"
    //% group="Mouvement basique"
    export function servoRotate(side: Side, speed: number): void {
        pins.servoWritePin(AnalogPin.P1, 90 + side * speed * 0.9)
        pins.servoWritePin(AnalogPin.P2, 90 - side * speed * 0.9)
    }

    /**
     * Permet d'arrêter la course des servomoteurs continus du robot Oobybot
     */
    //% block="[Servo] arrêter la course du robot"
    //% subcategory="Servomoteurs"
    //% group="Mouvement basique"
    export function servoStop(): void {
        pins.servoWritePin(AnalogPin.P1, 90)
        pins.servoWritePin(AnalogPin.P2, 90)
    }

    /**
     * Permet de contrôler un servomoteur continu (droit / gauche), sa direction (avant / arrière) et sa vitesse (de 0 à 100%) du robot Oobybot
     */
    //% block="[Servo] contrôler le servo $side direction $direction vitesse $speed %"
    //% subcategory="Servomoteurs"
    //% group="Mouvement avancé"
    export function servoControl(side: Side, direction: Movement, speed: number): void {
        if (side == Side.Right) {
            pins.servoWritePin(AnalogPin.P1, 90 + direction * speed * 0.9)
        } else {
            pins.servoWritePin(AnalogPin.P2, 90 - direction * speed * 0.9)
        }
    }

    /**
     * Permet de contrôler la direction (avant / arrière) ainsi que la vitesse (de 0 à 100%) des moteurs à courant continu du robot Oobybot
     * @param direction La direction du mouvement
     * @param speed La vitesse des moteurs
     */
    //% block="[MCC] contrôler le robot $direction vitesse $speed %"
    //% subcategory="Moteurs CC"
    //% group="Mouvement basique"
    export function dcMove(direction: Movement, speed: number): void {
        if (direction == Movement.Forward) {
            pins.analogWritePin(AnalogPin.P1, speed * 10.23)
            pins.analogWritePin(AnalogPin.P4, speed * 10.23)
        } else {
            pins.analogWritePin(AnalogPin.P3, speed * 10.23)
            pins.analogWritePin(AnalogPin.P2, speed * 10.23)
        }
    }

    /**
     * Permet de contrôler la direction (droite / gauche) ainsi que la vitesse (de 0 à 100%) des moteurs à courant continu du robot Oobybot
     * @param side La direction de rotation
     * @param speed La vitesse des moteurs
     */
    //% block="[MCC] pivoter vers la %side vitesse %speed %"
    //% subcategory="Moteurs CC"
    //% group="Mouvement basique"
    export function dcRotate(side: Side, speed: number): void {
        if (side == Side.Left) {
            pins.analogWritePin(AnalogPin.P1, speed * 10.23)
            pins.analogWritePin(AnalogPin.P2, speed * 10.23)
        } else {
            pins.analogWritePin(AnalogPin.P3, speed * 10.23)
            pins.analogWritePin(AnalogPin.P4, speed * 10.23)
        }
    }

    /**
     * Permet d'arrêter la course des moteurs à courant continu du robot Oobybot
     */
    //% block="[MCC] arrêter la course du robot"
    //% subcategory="Moteurs CC"
    //% group="Mouvement basique"
    export function dcStop(): void {
        pins.analogWritePin(AnalogPin.P1, 0)
        pins.analogWritePin(AnalogPin.P4, 0)
    }

    /**
     * Permet de contrôler un moteur à courant continu (droit / gauche), sa direction (avant / arrière) et sa vitesse (de 0 à 100%) du robot Oobybot
     */
    //% block="[MCC] contrôler le moteur $side direction $direction vitesse $speed %"
    //% subcategory="Moteurs CC"
    //% group="Mouvement avancé"
    export function dcControl(side: Side, direction: Movement, speed: number): void {
        if (side == Side.Right) {
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
     * Renvoi la distance (en cm ou en pouce) entre un objet et le robot Oobybot grâce à son capteur ultrason
     * @param unit L'unité de mesure de la distance
     */
    //% block="distance $unit"
    //% group="Capteurs"
    export function ultrasonicDistance(unit: DistanceUnit): number {
        return makerbit.getUltrasonicDistance(unit)
    }

    /**
     * Vérifie si le robot Oobybot est proche d'un objet
     * @param distance La distance à l'objet minimale
     * @param L'unité de mesure de la distance (cm / inch)
     */
    //% block="distance est inférieure à $distance $unit"
    //% group="Capteurs"
    export function ultrasonicDistanceLessThan(distance: number, unit: DistanceUnit): boolean {
        return makerbit.isUltrasonicDistanceLessThan(distance, unit)
    }
}
