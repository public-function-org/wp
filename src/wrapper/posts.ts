import {asc, desc} from "drizzle-orm";
import {PostsQueryArgs, wherePost, WordPress} from "../index.ts";
import {hydratePosts} from "../hydration";
import {pagination} from "../utils";

/**
 *
 * Selects posts from database and hydrates the result with metas and terms.
 *
 * @param {WordPress} wp
 * @param {PostsQueryArgs} args
 */
export async function queryPosts(
    wp: WordPress,
    args: PostsQueryArgs = {}
) {

    const db = wp.db;

    const {
        posts,
    } = wp;

    const {
        page = 1,
        perPage = 20,
        orderDirection = "desc",
        orderBy = wp.posts.date,
    } = args;

    // ------------------------------------
    // pagination
    // ------------------------------------
    const paged = pagination({page, perPage});

    // ------------------------------------
    // get posts
    // ------------------------------------
    const result = await db
        .select()
        .from(posts)
        .where(wherePost(wp, args))
        .orderBy((orderDirection == "desc" ? desc : asc)(orderBy))
        .limit(paged.limit)
        .offset(paged.offset);

    // ------------------------------------
    // hydrate with post metas and terms
    // ------------------------------------
    return hydratePosts(wp, result);
}