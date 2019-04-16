import { lineString } from "@turf/helpers";
import length from "@turf/length";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as sharedstreetsPbf from "sharedstreets-pbf";
import * as sharedstreets from "./src/index";

import * as turfHelpers from '@turf/helpers';
import envelope from '@turf/envelope';


import * as tiles from "./src/tiles";
import { TileIndex } from "./src/tile_index";
import { TilePathGroup, TileType, TilePathParams } from "./src/tiles";
import { CleanedPoints, CleanedLines } from "./src/geom";
import { polygon } from "@turf/envelope/node_modules/@turf/helpers";
import { Graph, GraphMode } from "./src/graph";

const test = require('tape');
 
// test("sharedstreets -- graph test", async (t:any) => {
 
//   var params = new TilePathParams();
//   params.source = 'osm/planet-181224';
//   params.tileHierarchy = 7;

//   // test polygon (dc area)
//   const content = fs.readFileSync('test/geojson/test_route.geojson');
//   var lineIn:turfHelpers.FeatureCollection<turfHelpers.LineString> = JSON.parse(content.toLocaleString());
//   var graph = new Graph(envelope(lineIn), params);
//   await graph.buildGraph();

//   //t.equal(graph.id, 'd626d5b0-0dec-3e6f-97ff-d9712228a282');
//   //var results = await graph.match(lineIn.features[0]);
//   //lineIn.features[0].geometry.coordinates.reverse();
//   var results2 = await graph.match(lineIn.features[0]);
//   console.log(JSON.stringify(results2));
//   // for(var result of results) {
//   //   console.log(JSON.stringify(result.toDebugView()));
//   // }

//     console.log(JSON.stringify(results2.toDebugView()));

//   t.end();

//  });


const readline = require('readline');


test("sharedstreets -- traces", async (t:any) => {
 
  var params = new TilePathParams();
  params.source = 'osm/planet-181224';
  params.tileHierarchy = 7;

  const fileStream = fs.createReadStream('100-formatted-trips.json');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  var features = [];
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    //console.log(`Line from file: ${line}`);
    features.push(JSON.parse(line.toLocaleString()));
  }
  var tripsIn:turfHelpers.FeatureCollection<turfHelpers.LineString> = turfHelpers.featureCollection(features);
  var graph = new Graph(envelope(tripsIn), params, null, GraphMode.PEDESTRIAN)
  await graph.buildGraph();

 
  for(var trip of tripsIn.features) {
    console.log("1");
    var results1 = await graph.matchTrace(trip);
    if(results1['segments'])
      console.log("segments: " + results1['segments'].length );
    console.log("2");
  }
  
  // for(var result of results) {
  //   console.log(JSON.stringify(result.toDebugView()));

  t.end();

 });