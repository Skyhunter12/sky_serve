

const fs = require('fs');
const xml2js = require('xml2js');

const turf = require('@turf/turf');

// Utility to read and parse different file types

exports.readFile = async (filePath)=> {
    const extension = filePath?.split('.')?.pop().toLowerCase();
  
    try {
      // Read the file
      const fileBuffer = fs.readFileSync(filePath);
  
      // Handle file types
      switch (extension) {
        case 'qml':
        case 'xml':
          return parseQML(fileBuffer.toString());
  
        case 'geojson':
        case 'json':
          return parseGeoJSON(fileBuffer.toString());
  
        case 'tiff':
          return await parseTIFF(fileBuffer);
  
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error.message);
    }
}
  
  // QML Parser
  function parseQML(data) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(data, (err, result) => {
        if (err) reject(`Error parsing QML: ${err.message}`);
        else resolve(result);
      });
    });
  }
  
  // GeoJSON Parser
  function parseGeoJSON(data) {
    try {
      const geojson = JSON.parse(data);
      console.log('GeoJSON Bounding Box:', turf.bbox(geojson)); // Example operation
      return geojson;
    } catch (err) {
      throw new Error(`Error parsing GeoJSON: ${err.message}`);
    }
  }
  
  // TIFF Parser
  async function parseTIFF(fileBuffer) {
    try {
        const GeoTIFF = await import('geotiff');
        const tiff = await GeoTIFF.fromArrayBuffer(fileBuffer.buffer);
        const image = await tiff.getImage();
        const data = await image.readRasters();
        console.log('TIFF Dimensions:', image.getWidth(), 'x', image.getHeight());
        return data;
        // ...existing code using parseString and GeoTIFF...
      
    } catch (err) {
      throw new Error(`Error reading TIFF: ${err.message}`);
    }
  }

  
exports.sanitizeData = async (data)=> {
 return await sanitizeData(data);
}

async function sanitizeData(data) {  
    if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (key?.startsWith('$')) {
                const newKey = key?.replace(/^\$/, '_');
                data[newKey] = data[key];
                delete data[key];
            }
            if (typeof data[key] === 'object') {
                sanitizeData(data[key]);
            }
        }
    }
    console.log('Sanitized Data:', data);
    
    return data;
};