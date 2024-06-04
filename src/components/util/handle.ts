import { FormInstance } from 'antd';
import api from '../../api';

interface IHasId {
    id: number;
}

class HandleUtil<T extends IHasId> {

    handleEdit = (obj: T, setEditing: React.Dispatch<React.SetStateAction<T | null>>, form: FormInstance, setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        setEditing(obj);
        form.setFieldsValue(obj);
        setIsModalVisible(true);
    }

    handleDelete = async (obj: T, context: string, setObj: React.Dispatch<React.SetStateAction<T[]>>, objArray: T[]) => {
       try{
            await api.delete(`/${context}/${obj.id}`);
            const updatedObjArray = objArray.filter(item => item.id !== obj.id);
            setObj(updatedObjArray);
       } catch(error) {
        console.log('Erro ao deletar.', error);
       }
        
    }

    handleCancel = (setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        setIsModalVisible(false);
    }

    handlePut = (form: FormInstance, context: string, editingObj: T, setObj: React.Dispatch<React.SetStateAction<T[]>>, obj: T[],  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>, sendBody: boolean = true) => {
        const updatedObject = form.getFieldsValue();
        const request = sendBody ? api.put(`/${context}/${editingObj!.id}`, updatedObject) : api.put(`/${context}/${editingObj!.id}`)

        request.then((response) => {
            setObj(obj.map(item => item.id === editingObj.id ? response.data.data : item));
            setIsModalVisible(false);
        }).catch(error => {
            console.log('Erro ao fazer update', error);
        }
        )
        console.log(form.getFieldsValue());
        setIsModalVisible(false);
    };


    handleDuplicityExceptionDetail = (detail: string): string =>{
        return detail.replace(/[()]/g, '').replace('=', ' = ');
    }
}

export default HandleUtil;