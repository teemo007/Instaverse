import { Alert, Button, Card, Form, Image, Input, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { normalizeApiError } from "../../../api/errors";
import { IMAGE_ACCEPT, uploadStoryImage, validateImageFile } from "../images";
import { createStory, updateStory } from "../storiesSlice";
import type { StoryFormValues, StoryInput } from "../story.types";
import styles from "./StoryForm.styles";
import type { StoryFormProps } from "./StoryForm.types";

const { Title } = Typography;

const StoryForm = ({ editId, setEditId }: StoryFormProps) => {
  const dispatch = useAppDispatch();
  const story = useAppSelector((state) =>
    editId
      ? state.stories.items.find((item) => item._id === editId) ?? null
      : null,
  );
  const user = useAppSelector((state) => state.auth.user);
  const [form] = Form.useForm<StoryFormValues>();
  const savedImage = Form.useWatch("image", form) as string | undefined;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    setSelectedFile(null);
    setFormError(null);
    if (fileInput.current) fileInput.current.value = "";
    if (story && user) {
      form.setFieldsValue({
        caption: story.caption,
        tags: story.tags,
        image: story.image,
        imageFileId: story.imageFileId,
      });
    } else {
      form.resetFields();
    }
  }, [form, story, user]);

  const reset = (): void => {
    form.resetFields();
    setSelectedFile(null);
    setFormError(null);
    if (fileInput.current) fileInput.current.value = "";
    setEditId(null);
  };

  const onSubmit = async (formValues: StoryFormValues): Promise<void> => {
    if (!user || submitting) {
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      let image = { image: formValues.image, imageFileId: formValues.imageFileId };
      if (selectedFile) {
        image = await uploadStoryImage(selectedFile);
        // Retain successful uploads so retrying a failed save doesn't upload twice.
        form.setFieldsValue(image);
        setSelectedFile(null);
        if (fileInput.current) fileInput.current.value = "";
      }
      const imageUnchanged = !!editId && image.image === story?.image;
      const storyInput: StoryInput = {
        caption: formValues.caption,
        tags: formValues.tags,
        ...(imageUnchanged ? {} : image),
      };
      if (editId) {
        await dispatch(
          updateStory({ storyId: editId, story: storyInput }),
        ).unwrap();
      } else {
        await dispatch(createStory(storyInput)).unwrap();
      }
      reset();
    } catch (error) {
      setFormError(normalizeApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card style={styles.formCard}>
        <Title level={4}>
          <span style={styles.formTitle}>Welcome to Instaverse!</span>
          <br />
          Welcome to Instaverse! Please{" "}
          <Link to="/authForm" state={{ mode: "signIn" }}>
            login
          </Link>{" "}
          or{" "}
          <Link to="/authForm" state={{ mode: "signUp" }}>
            register
          </Link>{" "}
          for sharing instant moments or ideas.
        </Title>
      </Card>
    );
  }

  return (
    <Card
      style={styles.formCard}
      title={
        <Title level={4} style={styles.formTitle}>
          {editId ? "Editing" : "Share"} a story
        </Title>
      }
    >
      <Form<StoryFormValues>
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        size="middle"
        onFinish={onSubmit}
        onFinishFailed={({ errorFields }) => setFormError(errorFields[0]?.errors[0] ?? "Check the story fields.")}
        disabled={submitting}
      >
        <Form.Item name="caption" label="Caption" rules={[{ required: true }]}>
          <Input.TextArea allowClear autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Input.TextArea allowClear autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="image" hidden rules={[{
          validator: (_, value: string | undefined) => selectedFile || value
            ? Promise.resolve()
            : Promise.reject(new Error("Choose an image before sharing.")),
        }]}>
          <Input />
        </Form.Item>
        <Form.Item name="imageFileId" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Image" required extra="JPEG, PNG, WebP, GIF or AVIF. Maximum 5 MB.">
          <input
            ref={fileInput}
            type="file"
            accept={IMAGE_ACCEPT}
            disabled={submitting}
            aria-label="Story image"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                validateImageFile(file);
                setSelectedFile(file);
                setFormError(null);
              } catch (error) {
                event.target.value = "";
                setSelectedFile(null);
                setFormError(normalizeApiError(error).message);
              }
            }}
          />
          {preview || savedImage ? <Image src={preview ?? savedImage} width={120} alt="Selected story image" /> : null}
        </Form.Item>
        {formError ? <Alert type="error" showIcon message={formError} style={{ marginBottom: 16 }} /> : null}
        <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
          <Button type="primary" block htmlType="submit" loading={submitting}>
            {submitting ? "Uploading / saving…" : "Share"}
          </Button>
        </Form.Item>
        {editId ? (
          <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
            <Button type="primary" block danger onClick={reset}>
              Discard
            </Button>
          </Form.Item>
        ) : null}
      </Form>
    </Card>
  );
};

export default StoryForm;
