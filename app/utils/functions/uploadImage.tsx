// Import Firebase modules
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Async function to upload image and get URL
async function uploadImageAndGetURL(imageUri) {
  const storage = getStorage();
  const imageName = `pets/${new Date().getTime()}-${imageUri.split('/').pop()}`;
  const storageRef = ref(storage, imageName);

  const response = await fetch(imageUri);
  const blob = await response.blob();

  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}
