// This returns URL ofimage
// Just need to give it a file to input of type jpeg, png, jpg (maybe a few others but typical image file types)
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
}