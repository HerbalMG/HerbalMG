const renderBlock = (block, index) => {
  try {
    switch (block.type) {
      case 'paragraph':
        return <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

      case 'header': {
        const Tag = `h${block.data.level}`;
        return <Tag key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
      }

      case 'list': {
  const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
  return (
    <ListTag key={index} className="pl-5 list-disc mb-4">
      {block.data.items.map((item, idx) => {
        // Handle both strings and objects
        const itemText = typeof item === 'string'
          ? item
          : item?.content || item?.text || JSON.stringify(item); // fallback if unexpected structure

        return (
          <li key={idx} dangerouslySetInnerHTML={{ __html: itemText }} />
        );
      })}
    </ListTag>
  );
}


      case 'image': {
        const imageUrl = block.data.file?.url || block.data.url;
        return (
          <div key={index} className="my-4">
            <img
              src={imageUrl}
              alt={block.data.caption || ''}
              className="rounded w-full max-h-96 object-contain"
            />
            {block.data.caption && (
              <p className="text-center text-sm text-gray-500 mt-1">{block.data.caption}</p>
            )}
          </div>
        );
      }

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 pl-4 italic text-gray-600 my-4">
            {block.data.text}
            {block.data.caption && (
              <footer className="text-right text-xs text-gray-400 mt-1">— {block.data.caption}</footer>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre
            key={index}
            className="bg-gray-100 p-4 rounded text-sm overflow-x-auto my-4"
          >
            <code>{block.data.code}</code>
          </pre>
        );
      case 'linkTool': {
        const { link, meta } = block.data;
        if (!link) return null;
        return (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded p-4 my-4 hover:shadow transition bg-gray-50"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="flex gap-4 items-center">
              {meta?.image && (
                <img src={meta.image} alt={meta.title || link} className="w-20 h-20 object-cover rounded" />
              )}
              <div>
                <div className="font-semibold text-lg mb-1">{meta?.title || link}</div>
                {meta?.description && (
                  <div className="text-gray-600 text-sm mb-1">{meta.description}</div>
                )}
                <div className="text-blue-600 text-xs break-all">{link}</div>
              </div>
            </div>
          </a>
        );
      }

      default:
        return null; // safely ignore unknown blocks
    }
  } catch (err) {
    // console.error('Error rendering block:', block, err);
    return null;
  }
};


const BlogReader = ({ blog, onBack }) => {
  if (!blog) return <div>No blog to display.</div>;

  // Parse content if it's a string
  let contentObj = blog.content;
  if (typeof contentObj === 'string') {
    try {
      contentObj = JSON.parse(contentObj);
    } catch (e) {
      contentObj = { blocks: [] };
    }
  }
  const blocks = contentObj?.blocks || [];

  return (
    <div className="fixed inset-0 overflow-auto bg-gray-50 p-8">
      <button
        className="mb-6 text-blue-600 underline"
        onClick={onBack}
      >
        ← Back to Blogs
      </button>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg">
        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-80 object-cover rounded mb-6"
          />
        )}

        <h1 className="text-4xl font-bold mb-3">{blog.title}</h1>
        <p className="text-gray-500 text-sm mb-5">
          Published on: {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Unknown'}
        </p>
        <p className="text-lg mb-8 text-gray-700">{blog.short_description}</p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-4 py-1 text-sm rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </div>
  );
};

export default BlogReader;
