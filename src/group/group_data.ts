import { ActivityType } from "../activity_type.js";
import RouteHistoryGroup from "./route_history_group.js";

/**
 * Interface made to know the data of a group that will be read from de db
 */
export interface GroupData {
  id: string;
  name: string;
  participants: string[];
  favoriteRoutes: string[];
  routeHistory: RouteHistoryGroup[];
  createdBy: string;
  activity: ActivityType;
}