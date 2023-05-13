# Práctica 12 - DestravateAPI

- Grupo G
  - Alejandro García Bautista
  - Lucas Pérez Rosario
  - Miguel Dorta Rodríguez
- Lunes 15 de mayo de 2023
- Desarrollo de Sistemas Informáticos
- Grado en Ingeniería Informática
- Universidad de La Laguna

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupog/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupog?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupog&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupog)

URL de la API REST: https://thoughtful-belt-tick.cyclic.app/

# Introducción

En esta última práctica en grupo se nos ha pedido que realicemos el desarrollo de una API REST, haciendo uso de Node/Express y MongoDB Atlas, con la que podremos hacer operaciones de creación, lectura, modificación y borrado de un registro de actividades deportivas, lo realizado en la anterior práctica grupal.

# Contenido

La jerarquía de ficheros dentro de **src** es la siguiente:
  - **Directorio db**: Contiene todo lo necesario para modelar nuestra base de datos que se encontrara en el servicio de MongoDB Atlas
    - **Directorio interfaces**: Contiene las distintas interfaces que se necesitan
      - `challenge_interface.ts`
      - `coordinate_interface.ts`
      - `group_interface.ts`
      - `track_history_interface.ts`
      - `track_interface.ts`
      - `user_interface.ts`
    - **Directorio models**: Contiene todos los modelos necesarios para añadir a la base de datos
      - `challenge.ts`
      - `group.ts`
      - `track.ts`
      - `user.ts`
    - **Directorio schemas**: Contiene los diferentes esquemas que serán usados por los modelos
      - `challenge_schema.ts`
      - `coordinates_schema.ts`
      - `group_schema.ts`
      - `track_history_schema.ts`
      - `track_schema.ts`
      - `user_schema.ts`
    - `activity_type.ts`: Enum con los distintos tipos de actividades que se pueden realizar
    - `collection.ts`: Contiene un enum con el nombre de todas las colecciones.
    - `index.ts`: Contiene una función para realizar una conexión a la base de datos.
  - **Directorio routes**: Contiene todas las rutas a las que se pueden acceder a nuestro servidor Express, ademas de las funcionalidades implementadas en cada ruta.
    - `_common.ts`: Contiene funciones comunes para todas las operaciones a realizar
    - `challenges.ts`: Contiene la ruta a `/challenges`, se encuentras implementadas las operaciones de PUT, POST, DELETE, GET tanto usando un query string como usando el ID de la entrada.
    - `groups.ts`: Contiene la ruta a `/groups`, se encuentras implementadas las operaciones de PUT, POST, DELETE, GET tanto usando un query string como usando el ID de la entrada.
    - `index.ts`: contiene la función de inicio del servidor y la ruta por defecto.
    - `tracks.ts`: Contiene la ruta a `/tracks`, se encuentras implementadas las operaciones de PUT, POST, DELETE, GET tanto usando un query string como usando el ID de la entrada.
    - `users.ts`: Contiene la ruta a `/users`, se encuentras implementadas las operaciones de PUT, POST, DELETE, GET tanto usando un query string como usando el ID de la entrada.
  - **Directorio utils**: 
    - `errors.ts`: contiene una función para comprobar si un objeto es un error nativo de JavaScript.
  - `index.ts`: Inicialización del servidor y conexión a la base de datos.

# Desarrollo

A continuación dejamos una explicación de cómo organizamos las interfaces, esquemas y modelos necesarios para la API REST y de las relaciones que existen entre ellas. Se podrán realizar operaciones en las siguientes ruta:
  - `/tracks`
  - `/users`
  - `/challenges`
  - `/groups`

Para poder hacer esto, tenemos colecciones de todo lo anterior donde podremos insertar documentos con información diferentes para cada uno.
Para poder insertar los objetos en la base de datos se necesitará, para cada tipo de objeto, una interfaz, un esquema y su modelo.

## _Tracks_

La interfaz de track tendrá aquellos campos necesarios que se indican en el guion de la práctica

```ts
export interface TrackInterface extends Document {
  name: string,
  start: CoordinatesInterface,
  end: CoordinatesInterface,
  distanceKm: number,
  averageSlope: number,
  userIds: string[],
  activity: ActivityType,
  averageScore: number
}
```

Esta interfaz será la que se usará para el Scheme de Tracks. El Scheme necesita los mismos campos que la interfaz pero adaptando ciertos tipos, por ejemplo, el tipo del _start_ no será la interfaz de coordenadas sino el Scheme de coordenadas. Indicar también que en el Scheme es donde haremos las validaciones para comprobar que la información de los objetos que se insertan en la base de datos es correcta.

```ts
  distanceKm: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0 || value > 41_000 || isNaN(value)) {
        throw new Error("invalid distance in kilometers");
      }
    }
  },
```

El código anterior representa el campo de la interfaz que indica la distancia total en kilómetros de la misma, entonces en este caso hay que hacer una comprobación sobre el valor de la misma. Esto se hará para algún otro campo del Scheme.

En cuanto al modelo, será el que se usará para crear objetos e introducirlos en la base de datos, este modelo usará el Schema que se desarrolla en cada caso.

Algo interesante a comentar es que en nuestro caso hemos añadido dos funciones más al fichero del modelo. Una de ellas, **function trackDocToTrack(ti: TrackInterface)** para mostrar un JSON de cada objeto únicamente con la información que debemos proporcionar al usuario (es decir, eliminando metadata de la base de datos como la versión del documento). Por otro lado, la función **function middlewareTrackRemoveRelated(id: string)**. Todas aquellas funciones en la práctica del estilo middleware serán las que nos permitirán realizar las eliminaciones en cascada de los objetos que tiene relaciones entre ellos.


## _Users_

La interfaz de users tendrá aquellos campos necesarios que se indican en el guion de la práctica

```ts
export interface UserInterface extends Document {
  _id: string; 
  name: string;
  friends: string[];
  groupFriends: string[]
  favoriteRoutes: string[];
  activeChallenges: string[];
  routeHistory: TrackHistoryEntryInterface[];
  activity: ActivityType;
}
```

Esta interfaz será la que se usará para el Scheme de Users. El Scheme necesita los mismos campos que la interfaz pero adaptando ciertos tipos, por ejemplo, el tipo del _favoriteRoutes_ no será un array de strings como tal sino que será un array de ID's de aquellas rutas favoritas del usuario. En este caso, aquí tenemos una de las relaciones que habíamos indicado anteriormente en el informe y es que, estos tracks favoritos del usuario deben existir en la base de datos obviamente y, además, si se elimina un track de la base de datos que es favorito del usuario se eliminará de esta lista de tracks favoritos del usuario.

```ts
  favoriteRoutes: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
```

Algo que también debemos especificar sobre los usuario es que en nuestro caso hemos cambiado el `_id` que proporciona MongoDB Atlas por un string ya que hemos considerado que es la mejor manera de identificar a los usuario. Además, este `_id` deberá ser único en la base de datos.

```ts
  _id: {
    type: String,
    required: true,
    unique: true
  },
```

En cuanto al modelo, es similar a lo que se comentó en el apartado sobre Tracks, tenemos de nuevo las dos funciones cuyos objetivos son los que se comentaron.

## _Groups_

La interfaz de groups tendrá aquellos campos necesarios que se indican en el guion de la práctica

```ts
export interface GroupInterface extends Document {
  name: string;
  participants: string[];
  favoriteRoutes: string[];
  routeHistory: TrackHistoryEntryInterface[];
  createdBy: string;
  activity: ActivityType;
}
```

Esta interfaz será la que se usará para el Scheme de Groups. El Scheme necesita los mismos campos que la interfaz pero adaptando ciertos tipos, por ejemplo, el tipo del _participants_ será un array de strings pero que tendrá una referencia a Users. En este caso tenemos también una relación de los participantes de un grupo ya que estos serán Users de la base datos, donde si se elimina un usuario de la base de datos, se eliminará de esta lista de participantes.

```ts
  participants: [{
    type: String,
    ref: "User"
  }],
```

En cuanto al modelo, es similar a lo que se comentó en el apartado sobre Tracks, tenemos de nuevo las dos funciones cuyos objetivos son los que se comentaron.

## _Challenges_

La interfaz de challenges tendrá aquellos campos necesarios que se indican en el guion de la práctica
```ts
export interface ChallengeInterface extends Document {
  name: string;
  routes: string[];
  userIds: string[];
  activity: ActivityType;
}
```

Esta interfaz será la que se usará para el Scheme de Challenges. El Scheme necesita los mismos campos que la interfaz pero adaptando ciertos tipos, por ejemplo, el tipo de _routes_ será un array de strings pero que tendrá una referencia a Track. En este caso tenemos también una relación de las rutas de un reto ya que estas serán Tracks de la base datos, donde si se elimina un track de la base de datos, se eliminará de esta lista de tracks del reto.

```ts
  routes: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
```

En cuanto al modelo, es similar a lo que se comentó en el apartado sobre Tracks, tenemos de nuevo las dos funciones cuyos objetivos son los que se comentaron.

# Dificultades encontradas

Las dificultades encontradas a lo largo de la realización de la práctica en grupo han sido las siguientes:
  - Surgieron problemas al momento de realizar las GitHub Actions debido que se ejecutaban múltiples veces los tests y se producían errores que no ocurrían en local, la solución fue añadir un identificador único que consta en la fecha y hora a la conexión de la base de datos
  - La mayor dificultad encontrada fue realizar la eliminación en cascada, porque no conseguimos hacer funcionar la nativa de Mongoose.

# Conclusión

En conclusión este segundo proyecto en grupo de la asignatura DSI, se ha realizado mediante sesiones colaborativas trabajando todos a la vez usando la extensión **Live Share** poniendo en común problemas que iban surgiendo y ayudándonos entre todos para resolver dichos problemas. 
Así como todos hemos aprendido a usar las herramientas de MongoDB Atlas y Cyclic para poder realizar y desplegar una API REST, ademas de poner en uso todos los conocimientos aprendidos a lo largo de la asignatura.
