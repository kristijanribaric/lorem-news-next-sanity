import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { classNames } from "primereact/utils";
import { FileUpload, FileUploadHandlerParam } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { FormData } from "../models";
import Image from "next/image";

const NewArticleForm: React.FC<{
  id: string;
  initialData?: FormData;
  update?: boolean;
}> = ({
  id,
  initialData = { title: "", content: "", category: null, image: null },
  update = false,
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [imageURL, setImageURL] = useState();
  const [disabled, setDisabled] = useState(false);
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);
  const router = useRouter();
  const defaultValues: FormData = {
    title: initialData.title,
    content: initialData.content,
    category: initialData.category,
  };
  const method = update ? "PATCH" : "POST";
  const showSuccess = (summary: string = "Success", detail: string = "") => {
    toast.current?.show({
      severity: "success",
      summary: summary,
      detail: detail,
      life: 3000,
    });
  };

  const showInfo = (summary: string = "Info", detail: string = "") => {
    toast.current?.show({
      severity: "info",
      summary: summary,
      detail: detail,
      life: 3000,
    });
  };

  const showError = useCallback(
    (summary: string = "Error", detail: string = "") => {
      toast.current?.show({
        severity: "error",
        summary: summary,
        detail: detail,
        life: 3000,
      });
    },
    []
  );

  const base64Encoder = (event: FileUploadHandlerParam) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function () {
      const base64data = reader.result;
      if (base64data) {
        uploadHandler(
          { image: base64data },
          "Image",
          "/api/upload-image",
          "POST"
        );
      } else {
        showError("Error", "Error while encoding the image");
      }
    };
  };

  async function uploadHandler<T>(
    initialData: T,
    dataType: string,
    url: string,
    method: string
  ) {
    try {
      setDisabled(true);
      showInfo(`Uploading ${dataType}`, `${dataType} is being uploaded`);
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(initialData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error();
      }

      const data = await response.json();
      setImageURL(data.url);
      showSuccess("Success!", `${dataType} uploaded successfully`);
    } catch (error) {
      showError("Error", `Error while uploading the ${dataType}`);
    }
    setDisabled(false);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        showError("Error while fetching Categories.");
      }
    };

    fetchCategories();
  }, [showError]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (initialData: FormData) => {
    const data = { image: imageURL, id: id, ...initialData };
    uploadHandler(data, "Article", "/api/upload-article", method);

    fileUploadRef.current?.clear();
    reset();
    router.push("/my-articles");
  };

  const getFormErrorMessage = (name: keyof FormData) => {
    return (
      errors[name] && (
        <small className="p-error">{errors[name]!.message!}</small>
      )
    );
  };

  return (
    <div className=" mb-6">
      <Toast ref={toast} />

      <div className="flex justify-content-center">
        <div className="card">
          <h1 className="text-center">Upload Article</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field">
              <label htmlFor="image">Image</label>

              <FileUpload
                ref={fileUploadRef}
                disabled={disabled}
                accept="image/*"
                maxFileSize={4000000}
                emptyTemplate={
                  initialData.image ? (
                    <Image
                      src={initialData.image}
                      alt={initialData.image}
                      width={178}
                      height={100}
                    />
                  ) : (
                    <p className="m-0">Drag and drop files here to upload.</p>
                  )
                }
                customUpload
                uploadHandler={base64Encoder}
                auto
              />
            </div>
            <div className="field">
              <label
                htmlFor="title"
                className={classNames({ "p-error": errors.title })}
              >
                Title*
              </label>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Title is required.",
                  maxLength: {
                    value: 100,
                    message: "Title must have less than 100 characters",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    autoFocus
                    className={classNames({
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />

              {getFormErrorMessage("title")}
            </div>
            <div className="field">
              <label
                htmlFor="content"
                className={classNames({ "p-error": errors.content })}
              >
                Content*
              </label>
              <Controller
                name="content"
                control={control}
                rules={{
                  required: "Article content is required.",
                  minLength: {
                    value: 50,
                    message: "Content must have more than 50 characters",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Editor
                    id={field.name}
                    {...field}
                    style={{ height: "320px" }}
                    onTextChange={(e) => field.onChange(e.htmlValue)}
                    className={classNames({
                      "p-invalid": fieldState.error,
                    })}
                  />
                )}
              />

              {getFormErrorMessage("content")}
            </div>

            <div className="field">
              <label
                htmlFor="category"
                className={classNames({ "p-error": errors.category })}
              >
                Category*
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category of the Article is required." }}
                render={({ field }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={categories}
                    optionValue="id"
                    optionLabel="name"
                  />
                )}
              />
            </div>

            <Button
              loading={disabled}
              type="submit"
              label="Submit"
              className="mt-2"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewArticleForm;
