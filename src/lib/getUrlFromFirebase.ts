import app from "../../firebase";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

const storage = getStorage(app);

export const getUrlFromFirebase = async (fileId: string) => {
    const storageRef = ref(storage, `uploads/${fileId}`);
    try {
        const pdfUrl = await getDownloadURL(storageRef);
        return pdfUrl;
    } catch (error) {
        console.log("Error downloading file: ", error);
        throw error;
    }
}

export const getAvatarUrls = async (): Promise<string[]> => {
    const avatarsRef = ref(storage, "avatars");
    const result = await listAll(avatarsRef);
    const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
    return Promise.all(urlPromises);
};