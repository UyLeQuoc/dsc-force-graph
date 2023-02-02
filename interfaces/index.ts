// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import { Timestamp } from "firebase/firestore";
import { GraphData } from "react-force-graph-3d";

export type User = {
  id: number
  name: string
}

export type IGraphInfo = {
	title: string;
	graph: GraphData;
	owner: string;
  lastModified: any;
  id: string;
}