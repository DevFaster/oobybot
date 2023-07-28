# Extension Oobybot pour MakeCode Micro:Bit

![Image du robot Oobybot](https://i.ytimg.com/vi/VDXwUR8QFRo/maxresdefault.jpg)

## Utiliser comme extension

Ce dépôt peut être ajouté en tant qu'**extension** dans MakeCode.

* ouvrez **[https://makecode.microbit.org/](https://makecode.microbit.org/)**
* cliquez sur **Nouveau projet**
* cliquez sur **Extensions** dans le menu engrenage
* recherchez **oobybot** et importez

## Le robot

L'Oobybot est un robot conçu à but pédagogique intervenant dans les écoles en France toute entière.
Facile à apprendre en main, intuitif, c'est un excellent outil dans l'initiation à la programmation et à la robotique.
Pour plus d'informations, rendez-vous sur **[host-i2.fr](https://host-i2.fr/i2learning/page-accueil-oobybot-4/?v=11aedd0e4327)**

Le robot utilise la carte micro:bit pour son cerveau, grâce à son extension, ses 21 broches peuvent être utilisées, dont déjà plusieurs par le robot :

* ``P0`` | Broche numérique : contrôle des LED
* ``P1`` | Broche analogique : contrôle du servomoteur droit
* ``P2`` | Broche analogique : contrôle du servomoteur gauche
* ``P3`` | Broche analogique : (moteurs TT ?)
* ``P4`` | Broche analogique : (moteurs TT ?)
* ``P5`` | Broche numérique : capteur suiveur de ligne droit
* ``P6`` | Broche numérique : capteur suiveur de ligne gauche
* ``P8`` | Broche numérique : déclencheur (trigger) du capteur ultrason
* ``P16`` | Broche numérique : récepteur (echo) du capteur ultrason

# Documentation

### Contrôler les LED

```blocks
Oobybot.ledControl(State.High)
```

Contrôle l'état des LED du robot (haut / bas).

Le bloc prend un seul paramètre : ``state`` (de type ``State``). ``state`` représente l'état de commande des LED, il peut prendre deux valeurs : ``State.High`` ("haut") et ``State.Low`` ("bas").

### Faire clignoter les LED

```blocks
Oobybot.ledBlink(500)
```

Fait clignoter les LED, le bloc est exécuté de manière asynchrone, il est ainsi possible que d'autres blocs soient exécutés en même temps.

Le bloc prend un seul paramètre : ``delay`` (un nombre). Le délai est donné en ms et représente la durée entre chaque changement d'état des LED.

### Arrêter le clignotement des LED

```blocks
Oobybot.ledStop()
```

Arrête le clignotement des LED.

### Changer la broche associée aux LED

```blocks
Oobybot.changeLedPin(DigitalPin.P0)
```

Change la broche associée au LED de la carte micro:bit. En temps normal, c'est la broche ``P0`` qui est associée aux LED.

Le bloc ne prend qu'un seul argument : ``pin`` (de type ``DigitalPin``). Pour plus d'informations sur le type ``DigitalPin``, allez voir la documentation de MakeCode micro:bit.

### Changer la broche associée à un servomoteur

```blocks
Oobybot.changeServoPin(Side.Left, AnalogPin.P1)
```

Change la broche associée au servomoteur choisi (de droite ou de gauche).

Le bloc prend deux arguments : ``side`` (de type ``Side``), et ``pin`` (de type ``AnalogPin``). ``side`` peut prendre deux valeurs différentes : ``Side.Left`` ("gauche") et ``Side.Right`` ("droit"). Pour plus d'informations sur le type ``AnalogPin``, allez voir la documentation de MakeCode micro:bit.

### Changer les broches associées au capteur ultrason

```blocks
Oobybot.changeUltrasonicPins(DigitalPin.P8, DigitalPin.P16)
```

Change les broches associées au capteur ultrason (trigger et echo).

Le bloc prend deux arguments : ``triggerPin`` et ``echoPin`` (de type ``DigitalPin``). Pour plus d'informations sur le type ``DigitalPin``, allez voir la documentation de MakeCode micro:bit.

### Changer la broche associée à un capteur suiveur de ligne

```blocks
Oobybot.changeLineFollowerPin(Side.Left, DigitalPin.P5)
```

Change la broche associée au capteur suiveur de ligne choisi (de droite ou de gauche).

Le bloc prend deux arguments : ``side`` (de type ``Side``), et ``pin`` (de type ``DigitalPin``). ``side`` peut prendre deux valeurs différentes : ``Side.Left`` ("gauche") et ``Side.Right`` ("droit"). Pour plus d'informations sur le type ``DigitalPin``, allez voir la documentation de MakeCode micro:bit.

### Se déplacer linéairement selon une vitesse

```blocks
Oobybot.move(Movement.Forward, 100)
```

Déplace le robot en ligne droite (en avant ou en arrière) selon une vitesse en pourcentage.

Le bloc prend deux arguments : ``direction`` (de type ``Movement``), et ``speed`` (un nombre). ``direction`` peut prendre deux valeurs distinctes : ``Movement.Forward`` ("avancer") et ``Movement.Backward`` ("reculer"). ``speed`` est un nombre compris entre 0 et 100, il représente un pourcentage de la vitesse maximale du moteur.

### Se déplacer linéairement sur une distance

```blocks
Oobybot.moveDistance(Movement.Forward, 100, DistanceUnit.CM, 80)
```

Déplace le robot en ligne droite (en avant ou en arrière) sur une certaine distance.

Le bloc prend quatre arguments, dont un optionnel : ``direction`` (de type ``Movement``), ``distance`` (un nombre), ``unit`` (de type ``DistanceUnit``), et ``speed`` (facultatif, un nombre). ``direction`` peut prendre deux valeurs distinctes : ``Movement.Forward`` ("avancer") et ``Movement.Backward`` ("reculer"). ``distance`` est un nombre, il représente la distance que le robot doit parcourir. ``unit`` est l'unité de la distance précédemment déterminé, elle peut prendre deux valeurs différentes : ``DistanceUnit.CM`` ("cm") et ``DistanceUnit.INCH`` ("inch" / pouce). ``speed`` est un nombre compris entre 0 et 100, il représente un pourcentage de la vitesse maximale du moteur. Ce paramètre est par défaut de 80%.

### Tourner dans un sens selon une vitesse

```blocks
Oobybot.rotate(Side.Left, 100)
```

Fait tourner le robot dans un sens (à gauche ou à droite) selon une certaine vitesse.

Le bloc prend deux paramètres : ``side`` (de type ``Side``), et ``speed`` (un nombre). ``side`` peut prendre deux valeurs différentes : ``Side.Left`` ("gauche") et ``Side.Right`` ("droit"). ``speed`` est un nombre compris entre 0 et 100, il représente un pourcentage de la vitesse maximale du moteur.

### Tourner dans un sens d'un angle précis

```blocks
Oobybot.rotateAngle(Side.Left, 90, 60)
```

Fait tourner le robot dans un sens (à gauche ou à droite) selon un certain angle.

Le bloc prend trois paramètres, dont un facultatif : ``side`` (de type ``Side``), ``angle`` (un nombre), et ``speed`` (facultatif, un nomre). ``side`` peut prendre deux valeurs différentes : ``Side.Left`` ("gauche") et ``Side.Right`` ("droit"). ``angle`` est un nombre compris entre 0 et 360, il représente l'angle de rotation en degrées (°). ``speed`` est un nombre compris entre 0 et 100, il représente un pourcentage de la vitesse maximale du moteur. Ce paramètre est par défaut de 60%.

### Arrêter la course du robot

```blocks
Oobybot.moveStop()
```

Arrête les moteurs du robot.

### Contrôler les moteurs du robot

```blocks
Oobybot.moveControl(Side.Left, Movement.Forward, 100)
```

Contrôle un des deux servomoteurs du robot (de droite ou de gauche), son sens et sa vitesse de rotation.

Le bloc prend trois paramètres : ``side`` (de type ``Side``), ``direction`` (de type ``Movement``), et ``speed`` (un nombre). ``side`` peut prendre deux valeurs différentes : ``Side.Left`` ("gauche") et ``Side.Right`` ("droit"). ``direction`` peut prendre deux valeurs distinctes : ``Movement.Forward`` ("avancer") et ``Movement.Backward`` ("reculer"). ``speed`` est un nombre compris entre 0 et 100, il représente un pourcentage de la vitesse maximale du moteur.

### Mesurer la distance jusqu'aux obstacles

```blocks
basic.showNumber(Oobybot.ultrasonicDistance(DistanceUnit.CM))
```

Mesure et retourne la distance jusqu'à l'obstacle le plus proche en face du robot.

Le bloc prend un seul paramètre : ``unit`` (de type ``DistanceUnit``). ``unit`` est l'unité dans laquelle on veut mesurer la distance, elle peut prendre deux valeurs différentes : ``DistanceUnit.CM`` ("cm") et ``DistanceUnit.INCH`` ("inch" / pouce).

### Vérifier la proximité à un obstacle

```blocks
basic.showNumber(Oobybot.ultrasonicDistanceLessThan(50, DistanceUnit.CM))
```

Mesure puis vérifie si le robot est à une distance inférieure d'un obstacle. Retourne ``true`` si oui, ``false`` sinon.

Le bloc prend deux arguments : ``distance`` (un nombre), et ``unit`` (de type ``DistanceUnit``). ``distance`` est un nombre, il représente la distane jusqu'à un obstacle minimale pour renvoyer ``false``. ``unit`` est l'unité dans laquelle on veut mesurer la distance, elle peut prendre deux valeurs différentes : ``DistanceUnit.CM`` ("cm") et ``DistanceUnit.INCH`` ("inch" / pouce).

### Mesurer l'état d'un capteur suiveur de ligne

```blocks
basic.showNumber(Oobybot.lineFollowerState(Side.Left))
```

Récupère et retourne l'état d'un capteur suiveur de ligne (de droite ou de gauche) : ``true`` s'il détecte du noir, ``false`` sinon.

Le bloc prend un seul argument : ``side`` (de type ``Side``). ``side`` peut prendre deux valeurs différentes : ``Side.Left`` ("gauche") et ``Side.Right`` ("droit")

### Suivre la ligne

```blocks
Oobybot.followLine()
```

Suit une ligne noire indéfiniment.

### Arrête de suivre la ligne

```blocks
Oobybot.stopFollowLine()
```

Arrête de suivre la ligne noire.

#### Métadonnées (utilisées pour la recherche, le rendu)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
