export type Json = { [key: string]: Json | undefined } | Json[] | boolean | null | number | string;

export interface Database {
	public: {
		CompositeTypes: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Tables: {
			comments: {
				Insert: {
					author_channel_url: string;
					author_display_name: string;
					author_profile_image_url: string;
					created_at?: string;
					id?: number;
					like_count: string;
					published_at: string;
					text_display: string;
					video_id: string;
				};
				Relationships: [
					{
						columns: ["video_id"];
						foreignKeyName: "comments_video_id_fkey";
						referencedColumns: ["video_id"];
						referencedRelation: "videos";
					},
				];
				Row: {
					author_channel_url: string;
					author_display_name: string;
					author_profile_image_url: string;
					created_at: string;
					id: number;
					like_count: string;
					published_at: string;
					text_display: string;
					video_id: string;
				};
				Update: {
					author_channel_url?: string;
					author_display_name?: string;
					author_profile_image_url?: string;
					created_at?: string;
					id?: number;
					like_count?: string;
					published_at?: string;
					text_display?: string;
					video_id?: string;
				};
			};
			videos: {
				Insert: {
					created_at?: string;
					id?: number;
					updated_at?: string;
					video_id: string;
				};
				Relationships: [];
				Row: {
					created_at: string;
					id: number;
					updated_at: string;
					video_id: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					updated_at?: string;
					video_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
	};
}
