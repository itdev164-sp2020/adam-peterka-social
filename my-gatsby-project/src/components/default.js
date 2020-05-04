import React from "react"
import { useQuery } from "@apollo/react-hooks"
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
export default () => {
  const { loading, error, data } = useQuery(GET_POSTS, {
    pollInterval: 2000,
  })

  if (loading) return <span> loading... </span>

  if (error) return <pre>{JSON.stringify(error)}</pre>

  return (
    <div>
      {data.posts.map(p => (
        <Post post={p}></Post>
      ))}
    </div>
  )
}
