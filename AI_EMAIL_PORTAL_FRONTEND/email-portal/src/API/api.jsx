import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const BaseURL = 'http://43.204.130.227'

export const useRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${BaseURL}/api/register/`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;

    },
    onSuccess: (data) => {
      toast.success('Registration successful');
      navigate('/login');
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post(
        `${BaseURL}/api/token/`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      const decodedUser = jwtDecode(data.access)
      localStorage.setItem('user', JSON.stringify(decodedUser))
      toast.success('Logged in Succesfully');
      navigate('/joblist');
    },
  });
};



export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return logout;
};


export const useJobForm = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${BaseURL}/api/job/`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;

    },
    onSuccess: (data) => {
      toast.success('Job Position Created');
      navigate('/joblist');
    },
    onError: (error) => {
      toast.error(error)

    }
  });
};
export const useJobApplication = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.post(
        `${BaseURL}/api/apply/${id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
  });
};

export const useRegenerateApplication = () => {
  return useMutation({
    mutationFn: async (jobId) => {
      const res = await axios.post(
        `${BaseURL}/api/apply/${jobId}/?regenerate=true`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      );
      return res.data.data;  // { id, subject, body, … }
    },
  });
};

export const useViewAllJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await axios.get(`${BaseURL}/api/job/`);
      return response?.data
    },
  });
};



export const JobApplicationView = (jobId) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await axios.get(`${BaseURL}/api/job_application/${jobId}`);
      return response.data;

    },
  });
};

export const useEditApplication = () => {

  return useMutation({
    mutationFn: async (params) => {
      const { id, data } = params;
      const response = await axios.put(
        `${BaseURL}/api/job_application/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;

    },
    onSuccess: (data) => {
      toast.success('Application Updated Successfully')
      console.log(data);
    },
  });
};

export const useSendEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ id, receiver_email }) => {
      const response = await axios.post(
        `${BaseURL}/api/send_application/${id}`,
        { receiver_email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
  
      navigate('/joblist');
    },
  });
};

export const UserProfileView = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios.get(`${BaseURL}/api/profile/`);
      return response.data;
    },
  });
};

export const UserAppliedJobs = () => {
  return useQuery({
    queryKey: ['Appled jobs'],
    queryFn: async () => {
      const response = await axios.get(`${BaseURL}/api/user-applied-jobs/`);
      return response.data;
    },
  });
};

export const usePrompts = () => {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const response = await axios.get(`${BaseURL}/api/prompts/`);
      return response.data;
    }
  });
};

export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPrompt) => {
      const response = await axios.post(`${BaseURL}/api/prompts/`, newPrompt);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });
};

export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedPrompt }) => {
      const response = await axios.patch(`${BaseURL}/api/prompts/${id}/`, updatedPrompt);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });
};

export const useDeletePrompt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BaseURL}/api/prompts/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });
};


// ─── SMTP CONFIG HOOKS ─────────────────────────────────────────────────────────

export const useSMTPConfigs = () => {
  return useQuery({
    queryKey: ['smtp-configs'],
    queryFn: async () => {
      const { data } = await axios.get(`${BaseURL}/api/smtp-configs/`);
      return data;
    },
  });
};

export const useCreateSMTPConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config) => {
      const { data } = await axios.post(`${BaseURL}/api/smtp-configs/`, config);
      return data;
    },
    onSuccess: () => qc.invalidateQueries(['smtp-configs']),
  });
};

export const useUpdateSMTPConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...config }) => {
      const { data } = await axios.put(`${BaseURL}/api/smtp-configs/${id}/`, config);
      return data;
    },
    onSuccess: () => qc.invalidateQueries(['smtp-configs']),
  });
};

export const useDeleteSMTPConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BaseURL}/api/smtp-configs/${id}/`);
    },
    onSuccess: () => qc.invalidateQueries(['smtp-configs']),
  });
};

export const useMails = () => {
  return useQuery({
    queryKey: ['mails'],
    queryFn: async () => {
      const { data } = await axios.get(`${BaseURL}/api/mails/`);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
