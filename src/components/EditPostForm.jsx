function EditPostForm({ post, onSave }) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      ...post,
      title,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        type='text'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button type='submit'>Save</button>
    </form>
  );
}

export default EditPostForm;
