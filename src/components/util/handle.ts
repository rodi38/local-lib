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

    handleCancel = (setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        setIsModalVisible(false);
    }

    handleOk = (form: FormInstance, context: string, editingObj: T, setObj: React.Dispatch<React.SetStateAction<T[]>>, obj: T[],  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        const updatedBook = form.getFieldsValue();
        api.put(`/${context}/${editingObj!.id}`, updatedBook).then((response) => {
            setObj(obj.map(item => item.id === editingObj.id ? response.data.data : item));
            setIsModalVisible(false);
        }).catch(error => {
            console.log('Erro ao fazer update do livro.', error);
        }
        )
        console.log(form.getFieldsValue());
        setIsModalVisible(false);
    };
}

export default HandleUtil;