import React from 'react';
import { theme } from '../../../../styles/theme';
import { StudentNewsArticleDTO } from '../../types';
import { Newspaper, Globe, Calendar, Tag } from 'lucide-react';

export interface NewsArticleCardProps {
  article: StudentNewsArticleDTO;
}

export const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article }) => {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.md,
        padding: theme.spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Oberer Meta-Streifen: Quelle, Kategorie, Datum */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: theme.spacing.xs,
          paddingBottom: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.neutral[100]}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
          <Globe size={14} color={theme.colors.primary.default} />
          <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary }}>
            {article.sourceName}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.secondary.default,
              backgroundColor: theme.colors.secondary.light,
              padding: '2px 8px',
              borderRadius: theme.borderRadius.sm,
            }}
          >
            <Tag size={12} /> {article.category}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.muted,
            }}
          >
            <Calendar size={12} /> {article.publishDate}
          </span>
        </div>
      </div>

      {/* Artikel-Inhalt */}
      <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'flex-start' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.neutral[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.text.secondary,
            flexShrink: 0,
          }}
        >
          <Newspaper size={26} />
        </div>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              margin: `0 0 ${theme.spacing.sm} 0`,
              lineHeight: theme.typography.lineHeight.tight,
            }}
          >
            {article.headline}
          </h2>

          <p
            style={{
              fontSize: theme.typography.fontSize.md,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.relaxed,
              margin: 0,
            }}
          >
            {article.teaserText}
          </p>
        </div>
      </div>
    </div>
  );
};
