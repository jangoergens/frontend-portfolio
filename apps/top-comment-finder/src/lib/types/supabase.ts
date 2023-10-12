export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			comments: {
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
				Relationships: [
					{
						foreignKeyName: 'comments_video_id_fkey';
						columns: ['video_id'];
						referencedRelation: 'videos';
						referencedColumns: ['video_id'];
					}
				];
			};
			videos: {
				Row: {
					created_at: string;
					id: number;
					updated_at: string;
					video_id: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					updated_at?: string;
					video_id: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					updated_at?: string;
					video_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
