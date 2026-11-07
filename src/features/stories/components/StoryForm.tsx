import { NumberOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Input, Modal, message } from "antd";
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";

import { normalizeApiError } from "../../../api/errors";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import UserAvatar from "../../../components/ui/UserAvatar";
import { IMAGE_ACCEPT, uploadStoryImage, validateImageFile } from "../images";
import { createStory, updateStory } from "../storiesSlice";
import type { StoryInput } from "../story.types";
import styles from "./StoryForm.module.css";
import type { StoryFormProps } from "./StoryForm.types";

const CAPTION_LIMIT = 2200;

interface SavedImage {
  image: string;
  imageFileId?: string;
}

const StoryForm = ({ open, editId, onClose }: StoryFormProps) => {
  const dispatch = useAppDispatch();
  const story = useAppSelector((state) =>
    editId ? state.stories.items.find((item) => item._id === editId) ?? null : null,
  );
  const user = useAppSelector((state) => state.auth.user);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [savedImage, setSavedImage] = useState<SavedImage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
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
    if (!open) return;
    setSelectedFile(null);
    setFormError(null);
    setDragging(false);
    if (fileInput.current) fileInput.current.value = "";
    setCaption(story?.caption ?? "");
    setTags(story?.tags ?? "");
    setSavedImage(
      story ? { image: story.image, imageFileId: story.imageFileId } : null,
    );
  }, [open, story]);

  useEffect(() => {
    if (open && !user) onClose();
  }, [open, user, onClose]);

  const pickFile = (file: File | undefined): void => {
    if (!file) return;
    try {
      validateImageFile(file);
      setSelectedFile(file);
      setFormError(null);
    } catch (error) {
      if (fileInput.current) fileInput.current.value = "";
      setFormError(normalizeApiError(error).message);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragging(false);
    if (!submitting) pickFile(event.dataTransfer.files?.[0]);
  };

  const close = (): void => {
    if (!submitting) onClose();
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!user || submitting) return;

    if (!selectedFile && !savedImage) {
      setFormError("Choose an image before sharing.");
      return;
    }
    if (!caption.trim()) {
      setFormError("Write a caption before sharing.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      let image = savedImage as SavedImage;
      if (selectedFile) {
        image = await uploadStoryImage(selectedFile);
        // Retain successful uploads so retrying a failed save doesn't upload twice.
        setSavedImage(image);
        setSelectedFile(null);
        if (fileInput.current) fileInput.current.value = "";
      }
      const imageUnchanged = !!editId && image.image === story?.image;
      const storyInput: StoryInput = {
        caption: caption.trim(),
        tags: tags.trim(),
        ...(imageUnchanged
          ? {}
          : { image: image.image, imageFileId: image.imageFileId }),
      };
      if (editId) {
        await dispatch(updateStory({ storyId: editId, story: storyInput })).unwrap();
        void message.success("Post updated.");
      } else {
        await dispatch(createStory(storyInput)).unwrap();
        void message.success("Your post has been shared.");
      }
      onClose();
    } catch (error) {
      setFormError(normalizeApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const shownImage = preview ?? savedImage?.image;
  const canSubmit = !!shownImage && !!caption.trim() && !submitting;

  return (
    <Modal
      open={open && !!user}
      onCancel={close}
      footer={null}
      closable={false}
      centered
      width="min(900px, calc(100vw - 32px))"
      className={styles.modal}
      maskClosable={!submitting}
      keyboard={!submitting}
    >
      <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
        <div className={styles.header}>
          <button
            type="button"
            className={`${styles.headerButton} ${styles.cancel}`}
            onClick={close}
            disabled={submitting}
          >
            Cancel
          </button>
          <h2 className={styles.title}>{editId ? "Edit post" : "Create new post"}</h2>
          <button
            type="submit"
            className={`${styles.headerButton} ${styles.submit}`}
            disabled={!canSubmit}
          >
            {submitting ? "Sharing…" : editId ? "Done" : "Share"}
          </button>
        </div>

        <div className={styles.content}>
          <div
            className={`${styles.media} ${dragging ? styles.mediaDragging : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {shownImage ? (
              <>
                <img className={styles.preview} src={shownImage} alt="Selected story image" />
                <button
                  type="button"
                  className={styles.change}
                  disabled={submitting}
                  onClick={() => fileInput.current?.click()}
                >
                  Change photo
                </button>
              </>
            ) : (
              <div className={styles.drop}>
                <PictureOutlined className={styles.dropIcon} />
                <p className={styles.dropText}>Drag photos here</p>
                <Button
                  type="primary"
                  disabled={submitting}
                  onClick={() => fileInput.current?.click()}
                >
                  Select from computer
                </Button>
                <p className={styles.dropHint}>
                  JPEG, PNG, WebP, GIF or AVIF · up to 5 MB
                </p>
              </div>
            )}
            <input
              ref={fileInput}
              type="file"
              hidden
              accept={IMAGE_ACCEPT}
              disabled={submitting}
              aria-label="Story image"
              onChange={(event) => pickFile(event.target.files?.[0])}
            />
          </div>

          <div className={styles.details}>
            {user ? (
              <div className={styles.author}>
                <UserAvatar username={user.username} size={28} />
                {user.username}
              </div>
            ) : null}
            <Input.TextArea
              className={styles.caption}
              variant="borderless"
              aria-label="Caption"
              placeholder="Write a caption…"
              autoSize={{ minRows: 5, maxRows: 10 }}
              maxLength={CAPTION_LIMIT}
              value={caption}
              disabled={submitting}
              onChange={(event) => setCaption(event.target.value)}
            />
            <div className={styles.counter}>
              {caption.length.toLocaleString()}/{CAPTION_LIMIT.toLocaleString()}
            </div>
            <label className={styles.field}>
              <NumberOutlined className={styles.fieldIcon} />
              <Input
                variant="borderless"
                aria-label="Tags"
                placeholder="Add tags, separated by spaces"
                value={tags}
                disabled={submitting}
                onChange={(event) => setTags(event.target.value)}
              />
            </label>
            {formError ? (
              <p className={styles.error} role="alert">
                {formError}
              </p>
            ) : null}
            <div className={styles.spacer} />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default StoryForm;
