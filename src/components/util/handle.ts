import { FormInstance, theme } from "antd";
import api from "../../api";
import { toast } from "react-toastify";

interface IHasId {
  id: number;
}


class HandleUtil<T extends IHasId> {
  handleEdit = (
    obj: T,
    setEditing: React.Dispatch<React.SetStateAction<T | null>>,
    form: FormInstance,
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setEditing(obj);
    form.setFieldsValue(obj);
    setIsModalVisible(true);
  };

  handleDelete = async (
    obj: T,
    context: string,
    setObj: React.Dispatch<React.SetStateAction<T[]>>,
    objArray: T[]
  ) => {
    try {
      await api.delete(`/${context}/${obj.id}`);
      const updatedObjArray = objArray.filter((item) => item.id !== obj.id);
      setObj(updatedObjArray);


      toast.success(`${this.handleEntityTranslation(context.charAt(0).toUpperCase() + context.slice(1))} deletado com sucesso.`, { theme: localStorage.getItem('theme') === "light" ? "colored" : "dark" })


    } catch (error: any) {
      if (error.response.data.errors) {
        error.response.data.errors.forEach((e: string) =>
          toast.error(e, { theme: localStorage.getItem('theme') === "light" ? "colored" : "dark", autoClose: 3000 })
        );
      }
      toast.error(error.response.data.message, {
        theme: localStorage.getItem('theme') === "light" ? "colored" : "dark",
        autoClose: 3000,
      });
    }
  };

  handleCancel = (
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsModalVisible(false);
  };

  handlePut = (
    form: FormInstance,
    context: string,
    editingObj: T,
    setObj: React.Dispatch<React.SetStateAction<T[]>>,
    obj: T[],
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    sendBody: boolean = true
  ) => {
    const updatedObject = form.getFieldsValue();
    const request = sendBody
      ? api.put(`/${context}/${editingObj!.id}`, updatedObject)
      : api.put(`/${context}/${editingObj!.id}`);

    request
      .then((response) => {
        setObj(
          obj.map((item) =>
            item.id === editingObj.id ? response.data.data : item
          )
        );

        toast.success(`${this.handleEntityTranslation(context.charAt(0).toUpperCase() + context.slice(1))} atualizado com sucesso.`, { theme: localStorage.getItem('theme') === "light" ? "colored" : "dark" })

        setIsModalVisible(false);
      })
      .catch((error: any) => {
        console.log(error);
        if (error.response.data.errors) {
          error.response.data.errors.forEach((e: string) =>
            toast.error(e, { theme: localStorage.getItem('theme') === "light" ? "colored" : "dark", autoClose: 3000 })
          );
        }
        toast.error(
            error.response.data.message
          ,
          { theme: localStorage.getItem('theme') === "light" ? "colored" : "dark", autoClose: 3000 }
        );
      });
    console.log(form.getFieldsValue());
    setIsModalVisible(false);
  };

  handleDuplicityExceptionDetail = (detail: string): string => {
    return detail.replace(/[()]/g, "").replace("=", " = ");
  };


  handleEntityTranslation = (context: string) => {
    if (context === "Loan") {
      return "Empréstimo";
    }
    if (context === "Student") {
      return "Estudante";
    }
    if (context === "Book") {
      return "Livro";
    }
  }
}

export default HandleUtil;
