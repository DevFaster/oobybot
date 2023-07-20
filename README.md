# Extension Oobybot pour MakeCode Micro:Bit

## Utiliser comme extension

Ce dépôt peut être ajouté en tant qu'**extension** dans MakeCode.

* ouvrez [https://makecode.microbit.org/](https://makecode.microbit.org/)
* cliquez sur **Nouveau projet**
* cliquez sur **Extensions** dans le menu engrenage
* recherchez **oobybot** et importez

## Utilisation

* Contrôler le robot Oobybot et son déplacement avec au choix, ses servomoteurs à rotation continu, ou ses motoréducteurs à courant continu.

```blocks
Oobybot.init(Version.Servo)
input.onButtonPressed(Button.A, function() {
	for (let i = 0; i < 4; i++) {
		Oobybot.move(Movement.Forward, 100)
		basic.pause(500)
		Oobybot.rotateAngle(Side.Left, 90)
	}
	Oobybot.stop()
})
```

* Lire les données des capteurs : capteur ultrason, capteurs suiveur de ligne

```blocks
basic.forever(function () {
	rightLineFollower = Oobybot.lineFollowerState(Side.Right)
	leftLineFollower = Oobybot.lineFollowerState(Side.Left)
	distance = Oobybot.ultrasonicDistance(DistanceUnit.CM)
})
```
