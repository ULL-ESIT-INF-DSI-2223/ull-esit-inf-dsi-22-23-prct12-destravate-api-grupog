import { Document, connect, model, Schema, ObjectId, Types } from 'mongoose';
//import Coordinates from "../route/coordinates.js";

//Enum colecciones
enum Collection {
    USERS = "users",
    TRACKS = "tracks",
    GROUPS = "groups",
    CHALLENGES = "challenges",
    TRACK_HISOTORY = "trackhistory"
}

//Interfaz Corrdenadas
interface CoordinatesInterface extends Document {
    latitude: number,
    longitude: number,
    mosl: number
    
}

//Schema Coordenadas
const CoordinatesSchema = new Schema<CoordinatesInterface>({
    latitude: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (value > 90 || value < -90 || isNaN(value)) {
              throw new Error("Invalid North-South Coordinate");
            }
        }
    },
    longitude: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (value > 180 || value < -180 || isNaN(value)) {
              throw new Error("Invalid East-West Coordinate");
            }
        }
    },
    mosl: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (value > 10_000 || value < -500 || isNaN(value)) {
              throw new Error("Invalid meters over sea level");
            }
        }
    }
})

//Interfaz Track
interface TrackInterface extends Document {
    name: string,
    start: CoordinatesInterface,
    end: CoordinatesInterface,
    distanceKm: number,
    averageSlope: number,
    userIds: string[],
    activity: ActivityType,
    averageScore: number
}


//Schema Track
const TrackSchema = new Schema<TrackInterface> ({
    name: {
        type: String,
        required: true,
        validate: (value: string) => {
            if (value === "") {
              throw new Error("invalid name");
            }
        }
    },
    start: {
        type: CoordinatesSchema,
        required: true
    },
    end: {
        type: CoordinatesSchema,
        required: true
    },
    distanceKm: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (value < 0 || value > 41_000 || isNaN(value)) {
              throw new Error("invalid distance in kilometers");
            }
        }
    },
    averageSlope: {
        type: Number,
        required: true,
    },
    userIds: {
        type: [String],
        required: true,
    },
    activity: {
        type: String,
        required: true,
        enum: ["Correr", "Ciclismo"]
    },
    averageScore: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (value < 1 || value > 10 || isNaN(value)) {
              throw new Error("invalid average score");
            }
        }
        
    }
    
})

//Modelo Track
const Track = model<TrackInterface>(Collection.TRACKS, TrackSchema);

interface ChallengeInterface extends Document {
  name: string;
  routes: string[];
  userIds: string[];
  activity: ActivityType;
}

const ChallengeScheme = new Schema<ChallengeInterface> ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    routes: {
        type: [String],
        required: true
    },
    userIds: {
        type: [String],
        required: true,
    },
    activity: {
        type: String,
        required: true,
        enum: ["Correr", "Ciclismo"]
    }
})

const Challenge = model<ChallengeInterface>(Collection.CHALLENGES, ChallengeScheme)

enum ActivityType {
  RUNNING = "Correr",
  BICYCLE = "Ciclismo",
}

interface TrackHistoryEntryInterface extends Document {
  routeId: ObjectId
  date: string
  kms: number
  averageSlope: number
}

const TrackHistoryEntrySchema = new Schema<TrackHistoryEntryInterface>({
  routeId: {
    type: Types.ObjectId,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  kms: {
    type: Number,
    required: true
  },
  averageSlope: {
    type: Number,
    required: true
  },
})

const TrackHistoryEntry = model<TrackHistoryEntryInterface>(Collection.TRACK_HISOTORY, TrackHistoryEntrySchema)

interface UserInterface extends Document {
  uid: string; 
  name: string;
  friends: string[];
  groupFriends: string[]
  favoriteRoutes: string[];
  activeChallenges: string[];
  routeHistory: string[];
  activity: ActivityType;
}

const UserSchema = new Schema<UserInterface>({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value === "") {
        throw new Error("invalid name");
      }
    },
    unique: true
  },
  friends: {
    type: [String],
    required: false
  },
  groupFriends: {
    type: [String],
    required: false
  },
  favoriteRoutes: {
    type: [String],
    required: false
  },
  activeChallenges: {
    type: [String],
    required: false
  },
  routeHistory: {
    type: [String],
    required: false
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Ciclismo"]
  },
})

const User = model<UserInterface>(Collection.USERS, UserSchema)

interface GroupInterface extends Document {
  name: string;
  participants: string[];
  favoriteRoutes: string[];
  routeHistory: string[];
  createdBy: string;
  activity: ActivityType;
}

const GroupSchema = new Schema<GroupInterface>({
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value === "") {
        throw new Error("invalid name");
      }
    },
    unique: true
  },
  participants: {
    type: [String],
    required: true
  },
  favoriteRoutes: {
    type: [String],
    required: false
  },
  createdBy: {
    type: String,
    required: true
  },
  routeHistory: {
    type: [String],
    required: false
  },
  activity: {
    type: String,
    required: true,
    enum: ["Correr", "Ciclismo"]
  },
})

const Group = model<GroupInterface>(Collection.GROUPS, GroupSchema)

connect('mongodb+srv://grupog:3iRlvRw9qxYyEaSP@destravatedb.fvzjaan.mongodb.net/test').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

const trackTest = new Track({
  id: "1",
  name: "Prueba",
  start: {latitude:81, longitude:100, mosl: 1_001},
  end: {latitude:81, longitude:100, mosl: 1_001},
  distanceKm: 1,
  averageSlope: 0,
  userIds: ["1", "12"],
  activity: "Ciclismo",
  averageScore: 5
})

trackTest.save().then((result) => {
  console.log("Ruta añadida")
}).catch((error) => {
  console.log(error)
})
