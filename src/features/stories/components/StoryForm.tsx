import { Button, Card, Form, Input, Typography } from "antd";
import { useEffect } from "react";
import FileBase64 from "react-file-base64";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
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

  useEffect(() => {
    if (story && user) {
      form.setFieldsValue({
        caption: story.caption,
        tags: story.tags,
        image: story.image,
      });
    }
  }, [form, story, user]);

  const reset = (): void => {
    form.resetFields();
    setEditId(null);
  };

  const onSubmit = async (formValues: StoryFormValues): Promise<void> => {
    if (!user) {
      return;
    }

    const storyInput: StoryInput = {
      ...formValues,
      username: user.username,
    };

    try {
      if (editId) {
        await dispatch(
          updateStory({ storyId: editId, story: storyInput }),
        ).unwrap();
      } else {
        await dispatch(createStory(storyInput)).unwrap();
      }
      reset();
    } catch {
      // The stories slice exposes the normalized request error.
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
      >
        <Form.Item name="caption" label="Caption" rules={[{ required: true }]}>
          <Input.TextArea allowClear autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Input.TextArea allowClear autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="image" label="Image" rules={[{ required: true }]}>
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => form.setFieldsValue({ image: base64 })}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
          <Button type="primary" block htmlType="submit">
            Share
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
