import { Page as PayloadPage, Media, Post as PayloadPost } from './payload-types';
import React from 'react';

export interface PageWithLayout extends PayloadPage {
  layout: {
    blockType: string;
    id?: string;
  } & (
    | {
        blockType: 'hero';
        title: string;
        subtitle?: string;
        content?: React.ReactNode;
        alignment?: 'left' | 'center' | 'right';
        media?: {
          id: string;
          relationTo: 'media';
          value: string | Media;
        };
        buttons?: {
          label: string;
          link: string;
          variant: 'default' | 'secondary' | 'outline';
        }[];
        backgroundType?: 'light' | 'dark' | 'custom';
        backgroundColor?: string;
      }
  )[];
}

// Extended Post type with populated authors
export interface PostWithPopulatedAuthors extends PayloadPost {
  populatedAuthors?: Array<{
    id: string;
    name: string;
  }>;
}

// Add more extended types as needed 