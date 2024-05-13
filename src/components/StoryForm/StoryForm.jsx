import { Card, Form, Input, Typography, Button } from "antd";
import styles from "./styles";
import FileBase64 from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
const { Title } = Typography;
import { createStory, updateStory } from "../../actions/stories";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ISLOGIN } from "../../constants/actionType";

const StoryForm = ({ editId, setEditId }) => {
  const dispatch = useDispatch();
  const story = useSelector((state) =>
    editId ? state.stories.find((story) => story?._id === editId) : null
  );

  const user = useSelector((state) => state.authenticationReducer.authData);

  const [form] = Form.useForm();

  const username = user?.result.username;

  const onSubmit = (formValues) => {
    editId
      ? dispatch(updateStory(editId, { ...formValues, username: username }))
      : dispatch(createStory({ ...formValues, username: username }));
    reset();
  };

  useEffect(() => {
    if (story && user) {
      form.setFieldsValue(story);
    }
  }, [story, form]);

  const reset = () => {
    form.resetFields();

    setEditId(null);
  };

  if (!user) {
    return (
      <Card style={styles.formCard}>
        <Title level={4}>
          <span style={styles.formTitle}>Welcome to Instaverse!</span>
          <br />
          Welcome to Instaverse! PLease{" "}
          <Link
            to="/authForm"
            onClick={() => dispatch({ type: ISLOGIN, payload: true })}
          >
            login
          </Link>{" "}
          or{" "}
          <Link
            to="/authForm"
            onClick={() => dispatch({ type: ISLOGIN, payload: false })}
          >
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
      <Form
        form={form}
        label={{ span: 6 }}
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
            onDone={(e) => {
              form.setFieldsValue({
                image: e.base64,
              });
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
          <Button type="primary" block htmlType="submit">
            Share
          </Button>
        </Form.Item>
        {!editId ? null : (
          <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
            <Button
              type="primary"
              block
              htmlType="button"
              danger
              onClick={reset}
            >
              Discard
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
};

export default StoryForm;
