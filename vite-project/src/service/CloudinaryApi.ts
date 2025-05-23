
import { Cloudinary } from "@cloudinary/url-gen";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dtshwjjbc',
  },
});

export function getImageThumbnailUrl(publicid : string){
    const url = cloudinary.image(publicid).setVersion(Date.now().toString()).toURL();
    console.log(url)
    return url;
}



export function addTransformationsToCloudinaryUrl(
  url: string, 
  width?: number, 
  height?: number, 
  cropType?: string,
  additionalTransformations?: string
): string {
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url; // Not a standard Cloudinary URL
  

  const transformations: string[] = [];

  if (width) {
    transformations.push(`w_${width}`);
  }
  
  if (height) {
    transformations.push(`h_${height}`);
  }
  
  if (cropType) {
    transformations.push(`c_${cropType}`);
  }
  
  if (additionalTransformations) {
    transformations.push(additionalTransformations);
  }
  
  if (transformations.length === 0) {
    return url;
  }
  
  const transformationString = transformations.join(',');
  
  return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
}
