interface UploadedBlob {
  status: string
  blobId: string
  endEpoch: number
  suiRefType: string
  suiRef: string
  suiUrl: string
  blobUrl?: string
  mediaType?: string
}

// Walrus Configuration
const SUI_NETWORK = "testnet";
const WALRUS_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";
const WALRUS_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";
const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;
const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;

export const storeBlob = async (file: any, storage_epochs: number, connected: boolean, address: string | undefined) => {

    try {
        // Add the account address if the user is connected
        console.log('Connected:', connected, address);
        const sendToParam = connected && address ? `&send_object_to=${address}` : "";

        if (typeof file === 'string' && file.startsWith('data:')) {
            const parts = file.split(';base64,');
            const contentType = parts[0].replace('data:', '');
            const base64 = parts[1];
            const byteCharacters = atob(base64);
            const byteArrays = [];
            for (let i = 0; i < byteCharacters.length; i += 512) {
                const slice = byteCharacters.slice(i, i + 512);
                const byteNumbers = new Array(slice.length);
                for (let j = 0; j < slice.length; j++) {
                    byteNumbers[j] = slice.charCodeAt(j);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            file = new Blob(byteArrays, { type: contentType });
        }

        // Upload the file to Walrus
        const response = await fetch(
            `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=${storage_epochs}${sendToParam}`,
            {
                method: "PUT",
                body: file,
            }
        );

        console.log('Walrus upload response:', response);

        if (response.status !== 200) {
            throw new Error(`Failed to upload blob: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('Blob uploaded successfully:', responseData);

        // Extract and return blob details
        let blobInfo: UploadedBlob;
        if ("alreadyCertified" in responseData) {
            blobInfo = {
                status: "Already certified",
                blobId: responseData.alreadyCertified.blobId,
                endEpoch: responseData.alreadyCertified.endEpoch,
                suiRefType: "Transaction Digest",
                suiRef: responseData.alreadyCertified.event.txDigest,
                suiUrl: `${SUI_VIEW_TX_URL}/${responseData.alreadyCertified.event.txDigest}`,

            };
        } else if ("newlyCreated" in responseData) {
            blobInfo = {
                status: "Newly created",
                blobId: responseData.newlyCreated.blobObject.blobId,
                endEpoch: responseData.newlyCreated.blobObject.storage.endEpoch,
                suiRefType: "Object ID",
                suiRef: responseData.newlyCreated.blobObject.id,
                suiUrl: `${SUI_VIEW_OBJECT_URL}/${responseData.newlyCreated.blobObject.id}`,
            };
        } else {
            throw Error("Unhandled successful response!");
        }

        // Add URL for retrieving the blob
        blobInfo.blobUrl = `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobInfo.blobId}`;
        blobInfo.mediaType = file.type;


        console.log('Blob info:', blobInfo);
        return blobInfo;

    } catch (error: any) {
        console.error('Error storing blob:', error);
        throw error;
    }
};