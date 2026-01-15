import auth from '../Auth/Auth';
import { ENV_VARS_WRAPPER } from '../configs/envVariables';

export interface UploadFileToAttributionModelParams {
  attributionModelId: string;
  teamId: number;
  file: File;
}

export const uploadFileToAttributionModel = async ({
  attributionModelId,
  teamId,
  file,
}: UploadFileToAttributionModelParams): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = auth.getAccessToken();

    if (!token || !auth.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const baseUrl = window[ENV_VARS_WRAPPER]?.REACT_APP_API_BASE_URL.replace('graphql', '');
    const url = `${baseUrl}teams/${teamId}/attribution-models/${attributionModelId}/files`;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Upload failed with status ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
