'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { m, useScroll, useMotionValueEvent } from 'framer-motion';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import Language from '@mui/icons-material/Language';
import { alpha, useTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Close,
  Email,
  Phone,
  Place,
  Church,
  Groups,
  Hiking,
  YouTube,
  MenuBook,
  Campaign,
  Facebook,
  Diversity3,
  AutoAwesome,
  EmojiEvents,
  Brightness7,
  ContentCopy,
  PhoneAndroid,
  SportsSoccer,
  FavoriteBorder,
  SportsBasketball,
  VolunteerActivism,
  CheckCircleOutline,
  CollectionsOutlined,
} from '@mui/icons-material';

import { useLanguage } from 'src/locales';

import { varFade, varZoom } from 'src/components/animate/variants';
import { MotionContainer } from 'src/components/animate/motion-container';

// Leaflet – chargé côté client uniquement
const LeafletMap = dynamic(
  () =>
    import('react-leaflet').then((mod) => {
      // Fix Leaflet default marker icon issue in Next.js / Webpack
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require('leaflet');
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      return mod.MapContainer;
    }),
  { ssr: false }
);
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const LeafletMarker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// ======================================================================
// DATA (structural only – text comes from translations)
// ======================================================================

const NAV_IDS = ['accueil', 'mission', 'activites', 'camps', 'galerie', 'contact'] as const;

const MISSION_ICONS = [Campaign, MenuBook, Diversity3, VolunteerActivism];

const SPIRITUAL_ICONS = [Groups, MenuBook, Church];

const SPORT_META = [
  { icon: SportsSoccer, color: 'success' as const },
  { icon: SportsBasketball, color: 'warning' as const },
];

const CAMP_ICONS = [Brightness7, EmojiEvents, AutoAwesome];

const GALLERY_SRCS = [
  '/assets/images/home/hero.jpeg',
  '/assets/images/home/hero2.jpeg',
  '/assets/images/home/hero3.jpeg',
  '/assets/images/home/hero4.jpeg',
  '/assets/images/home/hero5.jpg',
  '/assets/images/home/hero6.jpg',
  '/assets/images/home/hero7.jpg',
  '/assets/images/home/hero8.jpeg',
];

const ABOUT_ICONS = [Church, Groups, Hiking];

// ======================================================================
// FLOATING NAVBAR
// ======================================================================

function FloatingNavbar() {
  const theme = useTheme();
  const { scrollY } = useScroll();
  const { locale, t, toggleLocale } = useLanguage();

  const navItems = useMemo(
    () =>
      NAV_IDS.map((id) => ({
        id,
        label: t.nav[id],
      })),
    [t]
  );

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));
      const scrollPosition = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (section.el && section.el.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const handleNavClick = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  }, []);

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100 }}>
      <Box
        sx={{
          mx: 'auto',
          mt: scrolled ? 1.5 : 0,
          maxWidth: scrolled ? 960 : '100%',
          px: { xs: 1.5, md: 3 },
          py: 1,
          borderRadius: scrolled ? 999 : 0,
          backgroundColor: scrolled
            ? alpha(theme.palette.common.white, 0.88)
            : alpha(theme.palette.common.white, 0.95),
          backdropFilter: 'blur(14px)',
          boxShadow: scrolled
            ? `0 8px 32px ${alpha(theme.palette.grey[900], 0.12)}`
            : `0 1px 0 ${alpha(theme.palette.grey[500], 0.12)}`,
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: { xs: 1, md: 2 },
            flexShrink: 0,
            cursor: 'pointer',
          }}
          onClick={() => handleNavClick('accueil')}
        >
          <Box
            component="img"
            src="/logo/logotanA.png"
            alt="Tanora A LLB"
            sx={{ height: 40, width: 'auto', mr: 1 }}
          />
        </Box>

        {/* Desktop nav */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ flex: 1, justifyContent: 'center', display: { xs: 'none', md: 'flex' } }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                disableRipple
                sx={{
                  px: 2,
                  py: 0.75,
                  minWidth: 'auto',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 999,
                  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.grey[500], 0.08),
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>

        {/* Mobile nav */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            flex: 1,
            display: { xs: 'flex', md: 'none' },
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            py: 0.5,
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                disableRipple
                sx={{
                  px: 1.5,
                  py: 0.5,
                  minWidth: 'auto',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.08)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[500], 0.08),
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>

        {/* Language switcher */}
        <Button
          onClick={toggleLocale}
          size="small"
          disableRipple
          sx={{
            minWidth: 'auto',
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            fontSize: '0.8rem',
            fontWeight: 700,
            flexShrink: 0,
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            gap: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
            },
          }}
          startIcon={<Language sx={{ fontSize: 18 }} />}
        >
          {locale === 'fr' ? 'EN' : 'FR'}
        </Button>
      </Box>
    </Box>
  );
}

// ======================================================================
// MAIN PAGE
// ======================================================================

export default function HomePage() {
  const theme = useTheme();
  const { t } = useLanguage();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [donationOpen, setDonationOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const MVOLA_NUMBER = '034 00 000 00';

  const handleCopyNumber = useCallback(() => {
    navigator.clipboard.writeText(MVOLA_NUMBER.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [MVOLA_NUMBER]);

  return (
    <MotionContainer>
      <FloatingNavbar />

      {/* ============================== STICKY DONATION FAB ============================== */}
      <Fab
        onClick={() => setDonationOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 24, md: 32 },
          right: { xs: 16, md: 32 },
          zIndex: 1200,
          width: { xs: 56, md: 64 },
          height: { xs: 56, md: 64 },
          backgroundColor: '#fff',
          color: theme.palette.primary.main,
          boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.45)}`,
          '&:hover': {
            transform: 'scale(1.08)',
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.55)}`,
            color: '#fff',
          },
          transition: 'all 0.3s ease',
          animation: 'donationPulse 2.5s ease-in-out infinite',
          '@keyframes donationPulse': {
            '0%, 100%': { boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.45)}` },
            '50%': { boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.7)}, 0 0 0 8px ${alpha(theme.palette.primary.main, 0.15)}` },
          },
        }}
      >
        <FavoriteBorder sx={{ fontSize: { xs: 26, md: 30 } }} />
      </Fab>

      {/* ============================== DONATION MODAL ============================== */}
      <Dialog
        open={donationOpen}
        onClose={() => setDonationOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            overflow: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.darker} 100%)`,
            color: '#fff',
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => setDonationOpen(false)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: alpha('#fff', 0.7),
              '&:hover': { color: '#fff', backgroundColor: alpha('#fff', 0.1) },
            }}
          >
            <Close />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FavoriteBorder sx={{ color: theme.palette.primary.main, fontSize: 26 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {t.donation.modalTitle}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), lineHeight: 1.7 }}>
            {t.donation.modalDescription}
          </Typography>
        </Box>

        <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Pourquoi donner */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
            {t.donation.whyTitle}
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {t.donation.whyReasons.map((item, index) => (
              <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                <CheckCircleOutline
                  sx={{ color: theme.palette.secondary.dark, fontSize: 20, mt: 0.2, flexShrink: 0 }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Comment procéder */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
            {t.donation.howTitle}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
            {t.donation.howDescription}
          </Typography>

          {/* MVola Card */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: `${alpha(theme.palette.primary.main, 0.03)}`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <PhoneAndroid sx={{ color: theme.palette.secondary.dark, fontSize: 22 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {t.donation.mvolaLabel}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: '#fff',
                border: `1px solid ${alpha(theme.palette.grey[300], 0.8)}`,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.3 }}>
                  Numéro MVola
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: theme.palette.primary.main,
                    fontFamily: 'monospace',
                  }}
                >
                  {MVOLA_NUMBER}
                </Typography>
              </Box>
              <IconButton
                onClick={handleCopyNumber}
                sx={{
                  backgroundColor: copied
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.primary.main, 0.08),
                  color: copied ? theme.palette.success.main : theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: copied
                      ? alpha(theme.palette.success.main, 0.15)
                      : alpha(theme.palette.primary.main, 0.12),
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {copied ? <CheckCircleOutline /> : <ContentCopy />}
              </IconButton>
            </Stack>

            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5 }}>
              {t.donation.accountName} <strong>Tanora A LLB</strong>
            </Typography>
          </Box>

          {/* Étapes */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: theme.palette.primary.main }}>
              {t.donation.stepsTitle}
            </Typography>
            <Stack spacing={1}>
              {t.donation.steps.map((step, index) => {
                const displayStep = index === 2 ? `${step} ${MVOLA_NUMBER}` : step;
                return displayStep;
              }).map((step, index) => (
                <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      mt: 0.1,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {step}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontStyle: 'italic',
              lineHeight: 1.7,
            }}
          >
            {t.donation.bibleVerse}
            <br />
            <strong style={{ color: theme.palette.secondary.dark }}>{t.donation.bibleRef}</strong>
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => setDonationOpen(false)}
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 999,
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              fontSize: '1rem',
              boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
            }}
          >
            {t.donation.thankYou}
          </Button>
        </DialogContent>
      </Dialog>

      {/* ============================== HERO ============================== */}
      <Box
        id="accueil"
        sx={{
          minHeight: '100vh',
          background: `
            radial-gradient(ellipse at 20% 0%, ${alpha(theme.palette.secondary.main, 0.12)} 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, ${alpha(theme.palette.secondary.main, 0.06)} 0%, transparent 50%),
            radial-gradient(ellipse at 60% 50%, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 60%),
            #FAFAFA
          `,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 0 },
          pb: { xs: 8, md: 0 },
        }}
      >
        {/* Decorative diagonal yellow stripe (inspired by logo) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: '-5%',
            width: '45%',
            height: '100%',
            background: `linear-gradient(135deg, transparent 25%, ${alpha(theme.palette.secondary.main, 0.07)} 50%, transparent 75%)`,
            transform: 'skewX(-12deg)',
          }}
        />
        {/* Subtle bottom border accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${alpha(theme.palette.secondary.main, 0.3)}, transparent)`,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid
            container
            component={m.section}
            variants={varZoom('in', { distance: 200 })}
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
          >
            <Grid size={{ xs: 12, md: 6 }}>

              <Typography
                component={m.h1}
                variants={varFade('inUp')}
                variant="h1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.05,
                  mb: 3,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4rem' },
                }}
              >
                Tanora <span style={{ color: theme.palette.secondary.main, backgroundColor: alpha(theme.palette.primary.main, 1), padding: '0px 15px 7px', borderRadius: '20px' }}>A</span>
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    mt: 1,
                    fontFamily: '"Playfair Display", serif',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: { xs: '1.3rem', sm: '1.6rem', md: '4rem' },
                    color: theme.palette.text.secondary,
                    letterSpacing: '0.01em',
                  }}
                >
                  {t.hero.llbSubtitle}
                </Box>
              </Typography>

              <Typography
                component={m.p}
                variants={varFade('inUp', { distance: 40 })}
                variant="h5"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 560,
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                }}
              >
                {t.hero.description}
              </Typography>

              <Stack
                component={m.div}
                variants={varFade('inUp', { distance: 60 })}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    const el = document.getElementById('mission');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  sx={{
                    px: 4.5,
                    py: 1.8,
                    fontWeight: 800,
                    borderRadius: 999,
                    fontSize: '1rem',
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    boxShadow: `0 18px 45px ${alpha(theme.palette.primary.main, 0.25)}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 24px 60px ${alpha(theme.palette.primary.main, 0.35)}`,
                    },
                    transition: 'all 0.25s ease',
                  }}
                >
                  {t.hero.btnMission}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  sx={{
                    px: 4,
                    py: 1.7,
                    fontWeight: 600,
                    borderRadius: 999,
                    borderWidth: 2,
                    fontSize: '0.95rem',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  {t.hero.btnJoin}
                </Button>
              </Stack>
            </Grid>

            {/* Hero right - Masonry gallery */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mx: 'auto',
                }}
              >
                {/* Left column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, pt: { md: 4 } }}>
                  <Box
                    component={m.div}
                    variants={varFade('inUp', { distance: 40 })}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      '&:hover img': { transform: 'scale(1.06)' },
                    }}
                  >
                    <Box
                    component="img"
                      src="/assets/images/home/hero2.jpeg"
                      alt="Tanora A LLB - Jeunesse"
                    sx={{
                        width: '100%',
                        height: { xs: 200, md: 300 },
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </Box>
                  <Box
                    component={m.div}
                    variants={varFade('inUp', { distance: 40 })}
                    transition={{ delay: 0.15 }}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      '&:hover img': { transform: 'scale(1.06)' },
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/images/home/hero5.jpg"
                      alt="Tanora A LLB - Activités"
                      sx={{
                        width: '100%',
                        height: { xs: 140, md: 200 },
                      objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </Box>
                </Box>

                {/* Right column — offset for masonry effect */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <Box
                    component={m.div}
                    variants={varFade('inUp', { distance: 40 })}
                    transition={{ delay: 0.08 }}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      '&:hover img': { transform: 'scale(1.06)' },
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/images/home/hero4.jpeg"
                      alt="Tanora A LLB - Communion"
                      sx={{
                        width: '100%',
                        height: { xs: 140, md: 200 },
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </Box>
                  <Box
                    component={m.div}
                    variants={varFade('inUp', { distance: 40 })}
                    transition={{ delay: 0.22 }}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      '&:hover img': { transform: 'scale(1.06)' },
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/images/home/hero7.jpg"
                      alt="Tanora A LLB - Camp"
                      sx={{
                        width: '100%',
                        height: { xs: 200, md: 290 },
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================== ABOUT / PRÉSENTATION ============================== */}
      <Box
                    sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component={m.div}
                variants={varFade('inLeft', { distance: 40 })}
                sx={{
                  p: 5,
                      borderRadius: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)}, ${alpha(theme.palette.secondary.main, 0.06)})`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    opacity: 0.05,
                    '&::before': { content: '"✝"', fontSize: 200, color: theme.palette.primary.main },
                  }}
                />
                <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2 }}>
                  {t.about.overline}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
                  {t.about.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                  {t.about.paragraph1}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t.about.paragraph2}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                component={m.div}
                variants={varFade('inRight', { distance: 40 })}
                spacing={3}
              >
                {t.about.cards.map((card, idx) => {
                  const AboutIcon = ABOUT_ICONS[idx];
                  return { icon: AboutIcon, label: card.label, desc: card.desc };
                }).map((item, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2.5,
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.grey[900], 0.04)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                      }}
                    >
                      <item.icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Stack>
          </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================== MISSION & VISION ============================== */}
      <Box
        id="mission"
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
            <Stack
              component={m.div}
              variants={varFade('inUp', { distance: 40 })}
              spacing={2}
            sx={{ mb: 6, textAlign: 'center', maxWidth: 700, mx: 'auto' }}
            >
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2, fontWeight: 700 }}>
              {t.mission.overline}
              </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {t.mission.title}
              </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
              {t.mission.description}
              </Typography>
            </Stack>

            <Grid container spacing={3}>
            {t.mission.cards.map((card, index) => {
              const CardIcon = MISSION_ICONS[index];
              return { ...card, icon: CardIcon };
            }).map((card, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
                  <Card
                    component={m.div}
                    variants={varFade('inUp', { distance: 40 })}
                  transition={{ delay: index * 0.1 }}
                    sx={{
                      height: '100%',
                    p: 3.5,
                      borderRadius: 4,
                    textAlign: 'center',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                    bgcolor: alpha(theme.palette.common.white, 0.98),
                    boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.06)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 20px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    }}
                  >
                    <Box
                      sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      mx: 'auto',
                      mb: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                    }}
                  >
                    <card.icon sx={{ fontSize: 34 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {card.title}
                      </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        {card.description}
                      </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

          {/* Bible verse */}
          <Box
            component={m.div}
            variants={varFade('inUp', { distance: 30 })}
            sx={{
              mt: 8,
              p: { xs: 4, md: 5 },
              borderRadius: 4,
              textAlign: 'center',
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            
            <Typography
              variant="h5"
              sx={{ fontWeight: 400, fontStyle: 'italic', mb: 2, position: 'relative', lineHeight: 1.6, maxWidth: 700, mx: 'auto' }}
            >
              {t.mission.bibleVerse}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, position: 'relative' }}>
              {t.mission.bibleRef}
            </Typography>
          </Box>
        </Container>
          </Box>

      {/* ============================== ACTIVITÉS ============================== */}
      <Box
        id="activites"
        component="section"
        sx={{ py: { xs: 8, md: 12 }, backgroundColor: theme.palette.background.default }}
      >
        <Container maxWidth="lg">
                <Stack
                  component={m.div}
                  variants={varFade('inUp', { distance: 40 })}
                  spacing={2}
            sx={{ mb: 6, textAlign: 'center', maxWidth: 650, mx: 'auto' }}
                >
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2, fontWeight: 700 }}>
              {t.activities.overline}
                  </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {t.activities.title}
                  </Typography>
                </Stack>

          {/* Spiritual activities */}
          <Typography
            component={m.div}
            variants={varFade('inUp')}
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <MenuBook sx={{ color: 'primary.main' }} /> {t.activities.spiritualTitle}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {t.activities.spiritual.map((act, index) => {
              const ActIcon = SPIRITUAL_ICONS[index];
              return { ...act, icon: ActIcon };
            }).map((act, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={act.title}>
                      <Card
                        component={m.div}
                        variants={varFade('inUp', { distance: 40 })}
                  transition={{ delay: index * 0.08 }}
                        sx={{
                          height: '100%',
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    bgcolor: alpha(theme.palette.common.white, 0.98),
                    boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.05)}`,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                        }}
                      >
                  <CardContent sx={{ p: 3.5 }}>
                        <Box
                          sx={{
                        width: 60,
                        height: 60,
                            borderRadius: 2,
                        mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        border: `2px solid ${alpha(theme.palette.primary.main, 1)}`,
                        color: theme.palette.primary.main,
                          }}
                        >
                      <act.icon sx={{ fontSize: 30 }} />
                        </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {act.title}
                        </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {act.description}
                        </Typography>
                  </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

          {/* Sport activities */}
          <Typography
            component={m.div}
            variants={varFade('inUp')}
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <EmojiEvents sx={{ color: 'primary.main' }} /> {t.activities.sportTitle}
          </Typography>
          <Grid container spacing={3}>
            {t.activities.sport.map((sport, index) => ({
              ...sport,
              icon: SPORT_META[index].icon,
              color: SPORT_META[index].color,
            })).map((sport, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={sport.title}>
                <Card
                  component={m.div}
                  variants={varFade('inUp', { distance: 40 })}
                  transition={{ delay: index * 0.1 }}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    p: 4,
                    gap: 3,
                    border: `1px solid ${alpha(theme.palette[sport.color].main, 0.15)}`,
                    bgcolor: alpha(theme.palette.common.white, 0.98),
                    boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.05)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 16px 40px ${alpha(theme.palette[sport.color].main, 0.12)}`,
                      borderColor: alpha(theme.palette[sport.color].main, 0.3),
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${alpha(theme.palette[sport.color].main, 0.1)}, ${alpha(theme.palette[sport.color].main, 0.2)})`,
                      color: theme.palette[sport.color].main,
                    }}
                  >
                    <sport.icon sx={{ fontSize: 44 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {sport.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {sport.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
            </Grid>
        </Container>
          </Box>

      {/* ============================== CAMPS ============================== */}
      <Box
        id="camps"
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        }}
      >
        <Container maxWidth="lg">
            <Stack
              component={m.div}
              variants={varFade('inUp', { distance: 40 })}
              spacing={2}
            sx={{ mb: 6, textAlign: 'center', maxWidth: 680, mx: 'auto' }}
            >
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2, fontWeight: 700 }}>
              {t.camps.overline}
              </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {t.camps.title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
              {t.camps.description}
              </Typography>
            </Stack>

          <Grid container spacing={4}>
            {t.camps.items.map((camp, index) => ({
              ...camp,
              icon: CAMP_ICONS[index],
            })).map((camp, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={camp.title}>
                <Card
                    component={m.div}
                    variants={varFade('inUp', { distance: 40 })}
                  transition={{ delay: index * 0.12 }}
                    sx={{
                      height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                    bgcolor: alpha(theme.palette.common.white, 0.98),
                    boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.06)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 20px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
          
                  <CardContent sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                      borderRadius: 3,
                        mb: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                      }}
                    >
                      <camp.icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {camp.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.7 }}>
                      {camp.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      {camp.highlights.map((hl) => (
                    <Chip
                          key={hl}
                          label={hl}
                      size="small"
                      sx={{
                            mr: 0.75,
                            mb: 0.75,
                        borderRadius: 999,
                            fontSize: '0.72rem',
                        fontWeight: 600,
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            color: theme.palette.primary.main,
                            border: `1px solid ${alpha(theme.palette.primary.main, 1)}`,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
                </Grid>
              ))}
            </Grid>
        </Container>
          </Box>

      {/* ============================== GALERIE ============================== */}
      <Box
        id="galerie"
        component="section"
        sx={{ py: { xs: 8, md: 12 }, backgroundColor: theme.palette.background.default }}
      >
        <Container maxWidth="lg">
            <Stack
              component={m.div}
              variants={varFade('inUp', { distance: 40 })}
              spacing={2}
            sx={{ mb: 6, textAlign: 'center', maxWidth: 600, mx: 'auto' }}
            >
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2, fontWeight: 700 }}>
              <CollectionsOutlined sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
              {t.gallery.overline}
              </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {t.gallery.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t.gallery.description}
              </Typography>
            </Stack>

          <Grid container spacing={2}>
            {GALLERY_SRCS.map((src, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <Box
                  component={m.div}
                  variants={varFade('inUp', { distance: 30 })}
                  transition={{ delay: index * 0.05 }}
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    aspectRatio: '1/1',
                    '&:hover .gallery-overlay': { opacity: 1 },
                    '&:hover img': { transform: 'scale(1.08)' },
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={t.gallery.imageAlts[index] ?? ''}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <Box
                    className="gallery-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(to top, ${alpha('#000', 0.85)}, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                      {t.gallery.imageAlts[index] ?? ''}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
          </Box>

      {/* ============================== CONTACT ============================== */}
          <Box
        id="contact"
        component="section"
            sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.primary.main, 0.06)})`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack
                component={m.div}
                variants={varFade('inLeft', { distance: 40 })}
                spacing={3}
              >
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 2, fontWeight: 700 }}>
                    {t.contact.overline}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1.5 }}>
                    {t.contact.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {t.contact.description}
                  </Typography>
                </Box>

                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
              display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                      }}
                    >
                      <Email />
                    </Box>
                    <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t.contact.email}
            </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        tanora.a.llb@gmail.com
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                      }}
                    >
                      <Phone />
                    </Box>
                    <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t.contact.phone}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        +261 34 00 000 00
            </Typography>
          </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                      }}
                    >
                      <Place />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t.contact.address}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {t.contact.addressValue}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                  <IconButton
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                      '&:hover': { backgroundColor: theme.palette.primary.dark, transform: 'translateY(-2px)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                      '&:hover': { backgroundColor: theme.palette.primary.dark, transform: 'translateY(-2px)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <YouTube />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Card
                component={m.div}
                variants={varFade('inRight', { distance: 40 })}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                  boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.06)}`,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  {t.contact.formTitle}
                </Typography>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label={t.contact.formName} variant="outlined" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label={t.contact.formFirstName} variant="outlined" />
                    </Grid>
                  </Grid>
                  <TextField fullWidth label={t.contact.formEmail} variant="outlined" type="email" />
                  <TextField fullWidth label={t.contact.formSubject} variant="outlined" />
                  <TextField fullWidth label={t.contact.formMessage} variant="outlined" multiline rows={4} />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      px: 5,
                      py: 1.5,
                      fontWeight: 700,
                      borderRadius: 999,
                      alignSelf: 'flex-start',
                      backgroundColor: theme.palette.primary.main,
                      color: '#fff',
                      boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {t.contact.formSubmit}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Map Leaflet */}
          <Box
            component={m.div}
            variants={varFade('inUp', { distance: 40 })}
            sx={{
              mt: 6,
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
              boxShadow: `0 8px 30px ${alpha(theme.palette.grey[900], 0.06)}`,
              height: { xs: 300, md: 400 },
              position: 'relative',
              '.leaflet-container': {
                height: '100%',
                width: '100%',
              },
            }}
          >
            <LeafletMap
              center={[-18.908991, 47.525487]}
              zoom={20}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LeafletMarker position={[-18.908991, 47.525487]}>
                <Popup>
                  <strong>{t.contact.mapPopupName}</strong>
                  <br />
                  {t.contact.mapPopupOrg}
                  <br />
                  {t.contact.mapPopupCity}
                </Popup>
              </LeafletMarker>
            </LeafletMap>
          </Box>
        </Container>
      </Box>

      {/* ============================== FOOTER ============================== */}
      <Box
        component="footer"
        sx={{
          py: { xs: 4, md: 5 },
          backgroundColor: theme.palette.primary.darker,
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: { xs: 2, md: 0 } }}>
                <Box
                  component="img"
                  src="/logo/logo.png"
                  alt="Ligue pour la Lecture de la Bible"
                  sx={{ height: 48, width: 'auto',}}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                    {t.footer.orgName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                    {t.footer.orgSub}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), textAlign: { xs: 'left', md: 'center' } }}>
                {t.footer.bibleVerse}
                <br />
                <strong style={{ color: '#FFED00' }}>{t.footer.bibleRef}</strong>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="body2"
                sx={{ color: alpha('#fff', 0.5), textAlign: { xs: 'left', md: 'right' } }}
              >
                © {new Date().getFullYear()} {t.footer.copyright}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MotionContainer>
  );
}
