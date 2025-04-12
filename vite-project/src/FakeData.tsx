import { faker } from "@faker-js/faker";
import { Post } from "./type/Post";
import { Category } from "./type/Category";
import { User } from "./type/User";



// Generate fake users
// Generate fake categories
const categories: Category[] = Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.department(),
    slug: faker.lorem.slug(),
    parentCategory: Math.random() > 0.5 ? null : faker.string.uuid(),
    visible: faker.datatype.boolean(),
}));

// Generate fake users
const users: User[] = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    passwordHash: faker.string.uuid(),
    avatarUrl: faker.image.avatar(),
    phoneNumber: faker.phone.number(),
    role: faker.helpers.arrayElement(["admin", "editor", "viewer"]),
    dateOfBirth: faker.date.past({ years: 30 }),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent(),
}));

// Generate fake posts
const posts: Post[] = Array.from({ length: 100 }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    author: faker.helpers.arrayElement(users).id.toString(),
    date: faker.date.recent().toISOString(),
    category: faker.helpers.arrayElement(categories).id,
    status: faker.helpers.arrayElement(["draft", "published", "archived"]),
    thumbnail: faker.image.url(),
    summary: faker.lorem.sentences(2),
}));

export {categories, users, posts}