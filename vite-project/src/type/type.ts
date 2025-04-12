export type Post = {
  id: string,
  title: string,
  summary: string,
  content: string,
  dateCreated: Date,
  lastUpdate: Date,
  datePublished: Date,
  status: string,
  thumbnailUrl: string,
  moderator: string,
  author: string
}

export type User = {
  id: string,
  username: string,
  password: string,
  fullname: string,
  mail: string,
  position: 'ADMIN' | 'MODERATOR' | 'USER'
  description: string,

}