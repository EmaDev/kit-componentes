"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "../../../../../../../components/Card";
import { Button } from "../../../../../../../components/Button";
import { Breadcrumbs, type Crumb } from "../../../../../../../components/Breadcrumbs";
import { SocialPost } from "../../../../../../../components/SocialPost";
import { ImageCounter } from "../../../../../../../components/ImageCounter";
import { CommentBox } from "../../../../../../../components/CommentBox";
import { useToast } from "../../../../../../../components/Toast";
import { getPost } from "../../_data/posts";
import { useFeedStore, useCommentsFor } from "../../_store/feed";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const post = getPost(id);

  const liked = useFeedStore((s) => s.liked[id]);
  const saved = useFeedStore((s) => s.saved[id]);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const toggleSave = useFeedStore((s) => s.toggleSave);
  const addComment = useFeedStore((s) => s.addComment);
  const likeComment = useFeedStore((s) => s.likeComment);
  const comments = useCommentsFor(id);

  if (!post) {
    return (
      <Card className="py-16 text-center">
        <p className="text-sm text-muted mb-4">No encontramos ese post.</p>
        <Link href="/ejemplos/red-social">
          <Button variant="secondary">Volver al feed</Button>
        </Link>
      </Card>
    );
  }

  const gallery = post.media && post.media.length > 1 ? post.media : null;

  const crumbs: Crumb[] = [
    { label: "Ejemplos", href: "/ejemplos" },
    { label: "Red social", href: "/ejemplos/red-social" },
    { label: post.author.name },
  ];

  return (
    <div>
      <Breadcrumbs
        items={crumbs}
        className="mb-6"
        onNavigate={(item) => {
          if (item.href) router.push(item.href);
        }}
      />

      <div className="flex flex-col gap-5">
        <SocialPost
          author={post.author}
          time={post.time}
          text={post.text}
          media={gallery ? [] : post.media}
          counts={{ likes: post.likes, comments: comments.length, shares: post.shares }}
          liked={!!liked}
          saved={!!saved}
          onLike={() => toggleLike(post.id)}
          onSave={() => toggleSave(post.id)}
          onShare={() => toast({ title: "Compartido", description: post.author.name, variant: "success" })}
        />

        {gallery && (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Galería</p>
            <ImageCounter
              images={gallery.map((m) => ({ src: m.src, alt: m.alt }))}
              counter="bar"
              aspect={4 / 3}
              thumbs
              zoomable
            />
          </Card>
        )}

        <CommentBox
          comments={comments}
          currentUser={{ name: "Vos" }}
          title={`Comentarios (${comments.length})`}
          onSubmit={async (text, parentId) => addComment(post.id, text, parentId)}
          onLike={likeComment}
        />
      </div>
    </div>
  );
}
