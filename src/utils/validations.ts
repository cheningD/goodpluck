import gpZip from "@src/data/gp-zip.json";

const isZipCodeDeliverable = (zipCode: string): boolean => {
  const zipCodes: string[] = gpZip.map((item) => item.zip.toString());
  return zipCodes.includes(zipCode);
};

export { isZipCodeDeliverable };
