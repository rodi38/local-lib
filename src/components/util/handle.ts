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

    handleDelete = (obj: T, context: string, setObj: React.Dispatch<React.SetStateAction<T[]>>, objArray: T[]) => {
        api.delete(`/${context}/${obj.id}`).then((response) => {
            setObj(objArray.filter(item => item.id !== obj.id));
            console.log(response)
          }).catch(error => {
            console.log('Erro ao deletar.', error);
          });
    }

    handleCancel = (setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        setIsModalVisible(false);
    }

    handleOk = (form: FormInstance, context: string, editingObj: T, setObj: React.Dispatch<React.SetStateAction<T[]>>, obj: T[],  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>, sendBody: boolean = true) => {
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
}

export default HandleUtil;