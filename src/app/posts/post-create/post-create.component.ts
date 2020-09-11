import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  enteredContent = "";
  enterTittle = "";
  newPost = "No Content";
  post: Post;
  form: FormGroup;
  private postId: string;
  private mode: string;
  isLoading = false;
  imagePreview: string;
  private authStatusSub: Subscription;
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      tittle: new FormControl(null, {
        validators: [Validators.required, Validators.min(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.min(3)],
      }),

    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          console.log("kkkkk");
          this.post = {
            id: postData._id,
            tittle: postData.tittle,
            content: postData.content,
            creator: postData.creator
          };
          this.form.setValue({
            tittle: this.post.tittle,
            content: this.post.content,
          });
          console.log("tttttttttttt", this.post);
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }
 
  onSavePost() {
    console.log("adsfsasdad",this.form.value)
    // if (this.form.invalid) {
    //   return;
    // }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.tittle,
        this.form.value.content,

      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.tittle,
        this.form.value.content,

      );
    }

    this.form.reset();
  }
}
