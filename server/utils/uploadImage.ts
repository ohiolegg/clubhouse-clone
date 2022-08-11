import Axios from '../../core/axios';

interface UploadImageReturnProps {
  url: string;
  height: number;
  width: number;
  size: number;
}

const uploadImage = async (image: File): Promise<UploadImageReturnProps> => {
  const formData = new FormData();
  formData.append('image', image);

  const { data } = await Axios.post('/upload', formData, {
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });

  return data;
};

export default uploadImage;
