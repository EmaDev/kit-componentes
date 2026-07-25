"use client";

import { useRouter } from "next/navigation";
import { SocialPost } from "../../../../../components/SocialPost";
import { Poll } from "../../../../../components/Poll";
import { useToast } from "../../../../../components/Toast";
import { POSTS } from "./_data/posts";
import { useFeedStore } from "./_store/feed";

export default function FeedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const liked = useFeedStore((s) => s.liked);
  const saved = useFeedStore((s) => s.saved);
  const comments = useFeedStore((s) => s.comments);
  const pollVotes = useFeedStore((s) => s.pollVotes);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const toggleSave = useFeedStore((s) => s.toggleSave);
  const vote = useFeedStore((s) => s.vote);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Feed</h1>
        <p className="mt-1 text-sm text-muted">Mini app de red social — posts, encuestas y comentarios con hilos.</p>
      </div>

      <div className="flex flex-col gap-5">
        {POSTS.map((post) => {
          const postComments = comments.filter((c) => c.postId === post.id).length;
          return (
            <SocialPost
              key={post.id}
              author={post.author}
              time={post.time}
              text={post.text}
              media={post.media}
              counts={{ likes: post.likes, comments: postComments, shares: post.shares }}
              liked={!!liked[post.id]}
              saved={!!saved[post.id]}
              onLike={() => toggleLike(post.id)}
              onSave={() => toggleSave(post.id)}
              onComment={() => router.push(`/ejemplos/red-social/post/${post.id}`)}
              onShare={() => toast({ title: "Compartido", description: post.author.name, variant: "success" })}
              onMedia={() => router.push(`/ejemplos/red-social/post/${post.id}`)}
            >
              {post.poll && (
                <Poll
                  question={post.poll.question}
                  options={post.poll.options}
                  kind="single"
                  closesLabel="Cierra en 2 días"
                  voted={pollVotes[post.id] ?? null}
                  onVote={async (ids) => {
                    await new Promise((r) => setTimeout(r, 300));
                    vote(post.id, ids);
                  }}
                />
              )}
            </SocialPost>
          );
        })}
      </div>
    </div>
  );
}
