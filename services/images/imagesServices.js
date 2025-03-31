import { BlobServiceClient } from "@azure/storage-blob";
// import dotenv from "dotenv";

// dotenv.config();

// const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.NEXT_PUBLIC_AZURE_BLOB_CONNECTION_STRING);

// export const createContainer = async (containerName) =>  {
//   const containerClient = blobServiceClient.getContainerClient(containerName);
//   await containerClient.createIfNotExists();
// }

// export const listContainers = async () => {
//   let containers = blobServiceClient.listContainers();
//   for await (const container of containers) {
//       console.log(`Container Name: ${container.name}`);
//   }
//   return containers;
// }

export const uploadBlob = async (file) => {
  const containerURL = process.env.NEXT_PUBLIC_AZURE_BASE_SAS_URL;
  const blobName = `${Date.now()}-${file.name}`;
  const blobUrl = `${containerURL}/${blobName}?${process.env.NEXT_PUBLIC_AZURE_SAS_TOKEN}`;
  console.log("blobUrl: " + blobUrl);

  try {
    const response = await fetch(blobUrl, {
      method: "PUT",
      headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type
      },
      body: file
    });

    if(response.ok) {
      console.log("Upload successful:", blobUrl);
      return `https://seng513memory.blob.core.windows.net/images/${blobName}`;
    }else {
      console.log("Upload failed:", await response.text());
    }
  }catch (err) {
      console.log("Error uploading to Azure:", err);
      throw err;
  }

  
  // const containerClient = blobServiceClient.getContainerClient(containerName);
  
  // await containerClient.createIfNotExists();

  // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  // const stream = Readable.from(file.buffer);
  // const uploadOptions = { blobHTTPHeaders: { blobContentType: file.mimetype } };
  
  // await blockBlobClient.uploadStream(stream, file.buffer.length, undefined, uploadOptions);
  // console.log(`File uploaded successfully. Request ID: ${uploadBlobResponse.requestId}`);
  
}

// export const downloadBlob = async (containerName, blobName) =>  {
//   const containerClient = blobServiceClient.getContainerClient(containerName);
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   const downloadBlockBlobResponse = await blockBlobClient.downloadToFile("./downloaded-file.jpeg");
//   console.log(`Downloaded successfully to "downloaded-file.jpeg".`);
// }

// export const deleteContainer = async (containerName) => {
//   const containerClient = blobServiceClient.getContainerClient(containerName);

//   try {
//     await containerClient.delete();
//     console.log(`Container '${containerName}' deleted successfully.`);
//   } catch (error) {
//     console.error('Error deleting container (' + containerName + '): ', error.message);
//   }
// }