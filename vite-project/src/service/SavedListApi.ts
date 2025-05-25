import { baseUrl } from "@/utils/AppInfo";
import axios from "axios";

export const createSavedList = async (name: string) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${baseUrl}/users/me/saved-lists`, {
            name: name
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.result;
    } catch (error) {
        console.error('Error creating saved list:', error);
        throw error;
    }
};

export const getSavedListByPostId = async (postId: string) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${baseUrl}/articles/${postId}/saved-lists`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(response.data.code === 1000) {
            return response.data.result;
        }
        throw new Error('Error fetching saved list by post ID');
    }
    catch (error) {
        console.error('Error fetching saved list by post ID:', error);
        throw error;
    }
}

export const addPostToSavedList = async (listId: string, postId: string) => {
    try {
        const response = await axios.post(`${baseUrl}/saved-lists/${listId}/articles/`, {
            articleIds: [postId]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming Bearer token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding post to saved list:', error);
        throw error;
    }
};

export const renameSavedList = async (listId: string, name: string) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`${baseUrl}/saved-lists/${listId}`, {
            name: name
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.data.code === 1000) {
            return response.data
        }
        throw Error()
    } catch (error) {
        console.error('Error renaming saved list:', error)
        throw error
    }
}
export const getUserSavedLists = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${baseUrl}/users/me/saved-lists`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    
        return response.data.result;
    } catch (error) {
        console.error('Error fetching user saved lists:', error);
        throw error;
    }
};

export const deleteSavedList = async (listId: string) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${baseUrl}/saved-lists/${listId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.data.code === 1000) {
            return response.data

        }
        throw Error()
    } catch (error) {
        console.error('Error deleting saved list:', error)
        throw error
    }
}

export const removeArticleFromSavedList = async (listId: string, articleId: string) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${baseUrl}/saved-lists/${listId}/articles/${articleId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.data.code === 1000) {
            return response.data
        }
        throw Error()
    } catch (error) {
        console.error('Error removing article from saved list:', error)
        throw error
    }
}


export const fetchArticlesInSavedList = async (listId: string) => {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${baseUrl}/saved-lists/${listId}/articles`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (res.data.code === 1000) {
        return res.data.result
        throw new Error('Error fetching articles in saved list')
    }
}
export const removeArticleFromSavedListByPostId = async (postId: string, listId : string) => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${baseUrl}/saved-lists/${listId}/articles/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.data.code === 1000) {
            return response.data
        }
        throw Error()
    } catch (error) {
        console.error('Error removing article from saved list by post ID:', error)
        throw error
    }
}