import app from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { generateUniqueId } from "./utils";

export const uploadToFirebase = async (file: File) => {
    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
    }

    const storage = getStorage(app);

    const uniqueId = generateUniqueId();
    
    const sanitizedFileName = file.name.replace(/\s/g, '-');

    const storageRef = ref(storage, `uploads/${uniqueId}`);
    try {
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Handle progress updates
        uploadTask.on('state_changed',
            // (snapshot) => {
            //     // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //     // console.log('Upload is ' + progress + '% done');
            // },
            (error) => {
                // Handle unsuccessful uploads
                // console.error("Error uploading file: ", error);
                throw error;
            },
            () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    return {
                        fileId: uploadTask.snapshot.ref.name,
                        fileName: sanitizedFileName,
                        fileUrl: downloadURL,
                    }
                });
            }
        );

        // Wait for the upload to complete
        await uploadTask;

        return {
            fileId: uploadTask.snapshot.ref.name,
            fileName: sanitizedFileName,
            fileUrl: await getDownloadURL(uploadTask.snapshot.ref),
        }
    } catch (error) {
        // console.log("Error uploading file: ", error);
        throw error;
    }
}
