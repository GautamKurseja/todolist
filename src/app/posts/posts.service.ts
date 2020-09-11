import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { RouterModule, Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  constructor(private http: HttpClient, private router: Router) {}

  private posts: Post[] = [];
  private postUpadted = new Subject<{ posts: Post[]; postCount: number }>();

  addPost(tittle: string, content: string) {
    const post= { id: null, tittle: tittle, content: content };
    console.log("postdata,",post)

    this.http
      .post<{ message: string }>("http://localhost:4000/api/posts", post)
    //   .subscribe(responseData => {
    //     console.log(responseData.message);
    //     this.posts.push(post);
    //     this.postsUpdated.next([...this.posts]);
    //   });
    // this.http
    //   .post<{ message: string; post: Post }>(
    //     "http://localhost:4000/api/posts",
    //     postData
    //   )

      .subscribe((responseData) => {
       this.router.navigate(["/postlist"]);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      tittle: string;
      content: string;
      imagePath: string;
      creator: string;
    }>("http://localhost:4000/api/posts/" + id);
  }


  getPosts(postsPerPage: number, currentPage: number) {
    console.log(postsPerPage,"postsPerPage")
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:4000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                tittle: post.tittle,
                content: post.content,
                id: post._id,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postUpadted.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }





  getPostUpdateListner() {
    return this.postUpadted.asObservable();
  }

  deletePost(postId: string) {
    console.log("deletePost",postId)
    return this.http.delete("http://localhost:4000/api/posts/" + postId)
  }

  updatePost(
    id: string,
    tittle: string,
    content: string,

  ) {
    let postData: FormData | Post;
    if (typeof Image == "object") {
      postData = new FormData();
      postData.append("tittle", tittle),
        postData.append("content", content),
        postData.append("id", id);
    } else {
      postData = {
        id: id,
        tittle: tittle,
        content: content,
        creator: null
      };
    }
    this.http
      .put("http://localhost:4000/api/posts/" + id, postData)
      .subscribe((response) => {
        this.router.navigate(["/postlist"]);
        console.log("iam hereeeee");
      });
  }
}
