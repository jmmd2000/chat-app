/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
type ChatType = "DIRECT" | "GROUP";

enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface User {
  id: number;
  google_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url: string;
  created_at: Date;
  updated_at: Date;
  friendcode: string;

  chats: Chat[];
  messages: Message[];
  sentInvitations: ChatInvitation[];
  receivedInvitations: ChatInvitation[];
  readReceipts: ReadReceipt[];
}

export interface Chat {
  id: number;
  created_at: Date;
  updated_at: Date;

  participants: User[];
  messages: Message[];
  invitations: ChatInvitation[];
  type: ChatType;
}

export interface ChatInvitation {
  id: number;
  senderId: number;
  receiverId: number;
  chatId: number;
  status: InvitationStatus;
  createdAt: Date;

  sender: User;
  receiver: User;
  chat: Chat;
}

export interface Message {
  id: number;
  text: string;
  created_at: Date;
  senderGoogleId: number;
  chat_id: number;

  user: User;
  chat: Chat;
  readReceipts: ReadReceipt[];
}

export interface ReadReceipt {
  id: number;
  messageId: number;
  userId: number;
  readAt?: Date;

  message: Message;
  user: User;
}

export interface MessageEvent {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE" | "*";
  new: {
    chat_id: number;
    created_at: string;
    id: number;
    senderGoogleId: string;
    text: string;
  };
  old: unknown;
  errors: null;
}

// Type definitions from supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      _UserChats: {
        Row: {
          A: number;
          B: number;
        };
        Insert: {
          A: number;
          B: number;
        };
        Update: {
          A?: number;
          B?: number;
        };
        Relationships: [
          {
            foreignKeyName: "_UserChats_A_fkey";
            columns: ["A"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "_UserChats_B_fkey";
            columns: ["B"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Chat: {
        Row: {
          created_at: string;
          id: number;
          type: Database["public"]["Enums"]["ChatType"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          type: Database["public"]["Enums"]["ChatType"];
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          type?: Database["public"]["Enums"]["ChatType"];
          updated_at?: string;
        };
        Relationships: [];
      };
      ChatInvitation: {
        Row: {
          chatId: number;
          createdAt: string;
          id: number;
          receiverGoogleId: string;
          senderGoogleId: string;
          status: Database["public"]["Enums"]["InvitationStatus"];
        };
        Insert: {
          chatId: number;
          createdAt?: string;
          id?: number;
          receiverGoogleId: string;
          senderGoogleId: string;
          status: Database["public"]["Enums"]["InvitationStatus"];
        };
        Update: {
          chatId?: number;
          createdAt?: string;
          id?: number;
          receiverGoogleId?: string;
          senderGoogleId?: string;
          status?: Database["public"]["Enums"]["InvitationStatus"];
        };
        Relationships: [
          {
            foreignKeyName: "ChatInvitation_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ChatInvitation_receiverGoogleId_fkey";
            columns: ["receiverGoogleId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["google_id"];
          },
          {
            foreignKeyName: "ChatInvitation_senderGoogleId_fkey";
            columns: ["senderGoogleId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["google_id"];
          },
        ];
      };
      Message: {
        Row: {
          chat_id: number;
          created_at: string;
          id: number;
          senderGoogleId: string;
          text: string;
        };
        Insert: {
          chat_id: number;
          created_at?: string;
          id?: number;
          senderGoogleId: string;
          text: string;
        };
        Update: {
          chat_id?: number;
          created_at?: string;
          id?: number;
          senderGoogleId?: string;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Message_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Message_senderGoogleId_fkey";
            columns: ["senderGoogleId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["google_id"];
          },
        ];
      };
      ReadReceipt: {
        Row: {
          id: number;
          messageId: number;
          readAt: string | null;
          readerGoogleId: string;
        };
        Insert: {
          id?: number;
          messageId: number;
          readAt?: string | null;
          readerGoogleId: string;
        };
        Update: {
          id?: number;
          messageId?: number;
          readAt?: string | null;
          readerGoogleId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ReadReceipt_messageId_fkey";
            columns: ["messageId"];
            isOneToOne: false;
            referencedRelation: "Message";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ReadReceipt_readerGoogleId_fkey";
            columns: ["readerGoogleId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["google_id"];
          },
        ];
      };
      User: {
        Row: {
          avatar_url: string;
          created_at: string;
          first_name: string | null;
          friendcode: string;
          google_id: string;
          id: number;
          last_name: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url: string;
          created_at?: string;
          first_name?: string | null;
          friendcode: string;
          google_id: string;
          id?: number;
          last_name?: string | null;
          updated_at: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string;
          created_at?: string;
          first_name?: string | null;
          friendcode?: string;
          google_id?: string;
          id?: number;
          last_name?: string | null;
          updated_at?: string;
          username?: string | null;
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
      ChatType: "DIRECT" | "GROUP";
      InvitationStatus: "PENDING" | "ACCEPTED" | "DECLINED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
