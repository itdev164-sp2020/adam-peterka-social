import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"

const GET_POSTS = gql`
  query getPosts {
    posts {
      user {
        name
      }
      id
      title
      content
      created_at
      updated_at
    }
  }
`

const SET_POST = gql`
  mutation MyMutation($title: String!, $content: String!) {
    insert_posts(objects: { title: $title, content: $content }) {
      affected_rows
    }
  }
`
const Post = ({ post }) => {
  return (
    <div>
      <h3>
        {post.title} by {post.user.name}
      </h3>
      <div>{post.content}</div>
    </div>
  )
}

const PostEditor = () => {
  const [post, setPost] = useState({ title: "", content: "" })
  const [createPost, { data }] = useMutation(SET_POST)
  const handleChange = e => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    await createPost({
      variable: { title: post.title, content: post.content },
    })
    setPost({ title: "", content: "" })
  }
  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="title">title</label>
        <input
          type="text"
          onChange={handleChange}
          name="title"
          id="title"
          defaultValue={post.title}
          placeholer="Insert a title"
        />
      </p>
      <p>
        <label htmlFor="content">content</label>
        <input
          type="text"
          defaultValue={post.content}
          onChange={handleChange}
          name="content"
          id="content"
          placeholder="Insert content"
        />
      </p>
      <button type="submit">Create</button>
    </form>
  )
}
export default () => {
  const { loading, error, data } = useQuery(GET_POSTS, {
    pollInterval: 2000,
  })

  if (loading) return <span> loading... </span>

  if (error) return <pre>{JSON.stringify(error)}</pre>

  return (
    <div>
      <PostEditor />
      {data.posts.map(p => (
        <Post post={p}></Post>
      ))}
    </div>
  )
}
