'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, useScroll, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Church,
  Groups,
  MenuBook,
  Campaign,
  SportsBasketball,
  SportsSoccer,
  Hiking,
  Email,
  Phone,
  Place,
  Facebook,
  YouTube,
  Favorite,
  AutoAwesome,
  EmojiEvents,
  Diversity3,
  VolunteerActivism,
  Brightness7,
  CollectionsOutlined,
} from '@mui/icons-material';

import { varFade, varZoom } from 'src/components/animate/variants';
import { MotionContainer } from 'src/components/animate/motion-container';

// ======================================================================
// DATA
// ======================================================================

const NAV_ITEMS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'mission', label: 'Mission' },
  { id: 'activites', label: 'Activités' },
  { id: 'camps', label: 'Camps' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'contact', label: 'Contact' },
];

const MISSION_CARDS = [
  {
    title: 'Évangélisation',
    description:
      'Apporter la Bonne Nouvelle de Jésus-Christ aux jeunes, leur montrer l\'amour de Dieu et les accompagner dans leur cheminement de foi.',
    icon: Campaign,
  },
  {
    title: 'Édification spirituelle',
    description:
      'Aider chaque jeune à grandir dans sa relation avec Dieu à travers l\'étude de la Bible, la prière et la communion fraternelle.',
    icon: MenuBook,
  },
  {
    title: 'Communion fraternelle',
    description:
      'Créer une communauté soudée où les jeunes se soutiennent mutuellement, partagent et grandissent ensemble dans l\'amour du Christ.',
    icon: Diversity3,
  },
  {
    title: 'Service & engagement',
    description:
      'Encourager les jeunes à servir dans l\'église et la société, en étant des témoins vivants de la transformation par l\'Évangile.',
    icon: VolunteerActivism,
  },
];

const ACTIVITY_SPIRITUAL = [
  {
    title: 'Rencontres hebdomadaires',
    description: 'Chaque semaine, nous nous retrouvons pour des moments de louange, de prière et d\'étude biblique.',
    icon: Groups,
  },
  {
    title: 'Enseignements bibliques',
    description: 'Des enseignements profonds et adaptés aux jeunes pour mieux comprendre la Parole de Dieu.',
    icon: MenuBook,
  },
  {
    title: 'Veillées de prière',
    description: 'Des temps forts de prière collective pour intercéder et chercher la face de Dieu ensemble.',
    icon: Church,
  },
];

const ACTIVITY_SPORT = [
  {
    title: 'Football',
    description:
      'Des entraînements réguliers et des matchs amicaux pour développer l\'esprit d\'équipe et la discipline dans un cadre fraternel.',
    icon: SportsSoccer,
    color: 'success' as const,
  },
  {
    title: 'Basketball',
    description:
      'Sessions de basketball ouvertes à tous niveaux, favorisant la cohésion et le dépassement de soi entre jeunes du club.',
    icon: SportsBasketball,
    color: 'warning' as const,
  },
];

const CAMPS_DATA = [
  {
    title: 'Camp d\'édification spirituelle',
    description:
      'Plusieurs jours d\'immersion spirituelle : enseignements approfondis, ateliers pratiques, temps de louange et de prière dans un cadre inspirant.',
    icon: Brightness7,
    highlights: ['Enseignements thématiques', 'Ateliers pratiques', 'Louange & adoration', 'Communion fraternelle'],
  },
  {
    title: 'Camp sportif & récréatif',
    description:
      'Allier sport, jeux et moments spirituels. Un camp dynamique qui forge les amitiés et renforce le corps et l\'esprit.',
    icon: EmojiEvents,
    highlights: ['Tournois de foot & basket', 'Jeux d\'équipe', 'Randonnées', 'Feux de camp & témoignages'],
  },
  {
    title: 'Retraite spirituelle',
    description:
      'Un temps de pause pour se rapprocher de Dieu, loin du bruit quotidien. Méditation, jeûne et prière dans un lieu paisible.',
    icon: AutoAwesome,
    highlights: ['Méditation biblique', 'Temps de silence', 'Prière personnelle', 'Partages en petits groupes'],
  },
];

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?w=600&h=400&fit=crop', alt: 'Louange et adoration' },
  { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop', alt: 'Communion fraternelle' },
  { src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop', alt: 'Football entre jeunes' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop', alt: 'Basketball' },
  { src: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop', alt: 'Étude biblique' },
  { src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop', alt: 'Camp de jeunes' },
  { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop', alt: 'Groupe de jeunes' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop', alt: 'Nature - retraite' },
];

// ======================================================================
// FLOATING NAVBAR
// ======================================================================

function FloatingNavbar() {
  const theme = useTheme();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((item) => ({
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
  }, []);

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
        {/* Logo texte */}
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
          <Church sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Tanora A
          </Typography>
        </Box>

        {/* Desktop nav */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ flex: 1, justifyContent: 'center', display: { xs: 'none', md: 'flex' } }}
        >
          {NAV_ITEMS.map((item) => {
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
          {NAV_ITEMS.map((item) => {
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
      </Box>
    </Box>
  );
}

// ======================================================================
// MAIN PAGE
// ======================================================================

export default function HomePage() {
  const theme = useTheme();

  return (
    <MotionContainer>
      <FloatingNavbar />

      {/* ============================== HERO ============================== */}
      <Box
        id="accueil"
        sx={{
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.12)} 0%, transparent 50%),
            linear-gradient(160deg, ${alpha(theme.palette.primary.darker, 0.95)} 0%, ${theme.palette.primary.main} 50%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 0 },
          pb: { xs: 8, md: 0 },
        }}
      >
        {/* Decorative cross pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: 200,
            height: 200,
            opacity: 0.06,
            '&::before': {
              content: '"✝"',
              fontSize: 200,
              color: '#fff',
              position: 'absolute',
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '3%',
            width: 120,
            height: 120,
            opacity: 0.04,
            '&::before': {
              content: '"✝"',
              fontSize: 120,
              color: '#fff',
              position: 'absolute',
            },
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
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Département Jeunesse • LLB"
                sx={{
                  mb: 2.5,
                  borderRadius: 999,
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                  color: theme.palette.secondary.light,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                }}
              />

              <Typography
                component={m.h1}
                variants={varFade('inUp')}
                variant="h1"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.05,
                  mb: 3,
                  color: '#fff',
                  fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4rem' },
                }}
              >
                Tanora A
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  LLB
                </Box>
              </Typography>

              <Typography
                component={m.p}
                variants={varFade('inUp', { distance: 40 })}
                variant="h5"
                sx={{
                  color: alpha('#fff', 0.85),
                  maxWidth: 560,
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                }}
              >
                Le département jeunesse de la Ligue pour la Lecture de la Bible.
                Ensemble, nous grandissons dans la foi, partageons l&apos;Évangile et vivons
                des moments inoubliables au service du Christ.
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
                    fontWeight: 700,
                    borderRadius: 999,
                    fontSize: '1rem',
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.primary.darker,
                    boxShadow: `0 18px 45px ${alpha(theme.palette.secondary.main, 0.4)}`,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 24px 60px ${alpha(theme.palette.secondary.main, 0.5)}`,
                    },
                    transition: 'all 0.25s ease',
                  }}
                >
                  Découvrir notre mission
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
                    borderColor: alpha('#fff', 0.4),
                    color: '#fff',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#fff',
                      backgroundColor: alpha('#fff', 0.08),
                    },
                  }}
                >
                  Nous rejoindre
                </Button>
              </Stack>
            </Grid>

            {/* Hero right - decorative */}
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 380,
                  height: 380,
                }}
              >
                {/* Main circle */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)}, ${alpha(theme.palette.primary.light, 0.15)})`,
                    border: `2px solid ${alpha('#fff', 0.1)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Church sx={{ fontSize: 80, color: alpha('#fff', 0.9) }} />
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, textAlign: 'center' }}>
                    Tanora A
                  </Typography>
                  <Typography variant="body1" sx={{ color: alpha('#fff', 0.7), fontWeight: 500 }}>
                    Ligue pour la Lecture de la Bible
                  </Typography>
                </Box>
                {/* Orbiting icons */}
                {[
                  { Icon: MenuBook, top: '-5%', left: '50%', delay: '0s' },
                  { Icon: Favorite, top: '50%', right: '-8%', delay: '2s' },
                  { Icon: Groups, bottom: '-5%', left: '50%', delay: '4s' },
                  { Icon: SportsSoccer, top: '50%', left: '-8%', delay: '6s' },
                ].map(({ Icon, delay, ...pos }, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: 'absolute',
                      ...pos,
                      transform: 'translate(-50%, -50%)',
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: alpha('#fff', 0.12),
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: `pulse 3s ease-in-out ${delay} infinite`,
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
                        '50%': { transform: 'translate(-50%, -50%) scale(1.15)', opacity: 1 },
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 28, color: theme.palette.secondary.light }} />
                  </Box>
                ))}
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
                  Qui sommes-nous ?
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
                  Un club au service de la jeunesse chrétienne
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                  <strong>Tanora A LLB</strong> est le département jeunesse de la <strong>Ligue pour la Lecture
                  de la Bible</strong>. Notre vocation : rassembler les jeunes autour de la Parole de Dieu,
                  les accompagner dans leur croissance spirituelle et leur offrir un cadre épanouissant
                  alliant foi, fraternité et activités enrichissantes.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  Que ce soit à travers nos rencontres spirituelles, nos activités sportives ou nos camps
                  d&apos;édification, nous croyons que chaque jeune est appelé à vivre pleinement sa foi
                  et à impacter sa génération pour Christ.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                component={m.div}
                variants={varFade('inRight', { distance: 40 })}
                spacing={3}
              >
                {[
                  { icon: Church, label: 'Fondé sur la Parole de Dieu', desc: 'La Bible est au cœur de toutes nos activités et enseignements.' },
                  { icon: Groups, label: 'Une communauté vivante', desc: 'Des centaines de jeunes unis par la même passion pour Christ.' },
                  { icon: Hiking, label: 'Activités variées', desc: 'Spirituel, sportif, culturel : un programme riche pour chaque jeune.' },
                ].map((item, idx) => (
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
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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
              Notre mission & vision
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Apporter l&apos;Évangile aux jeunes, grandir ensemble dans la foi
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
              Notre vision est de voir chaque jeune touché par l&apos;amour de Dieu, enraciné dans Sa Parole
              et engagé au service de Son Royaume. Nous croyons en une jeunesse transformée et transformatrice.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {MISSION_CARDS.map((card, index) => (
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
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                      color: theme.palette.primary.main,
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M18 0v20H0V0h18zm2 0h20v20H20V0zM0 22h18v18H0V22zm22 0h18v18H22V22z\'/%3E%3C/g%3E%3C/svg%3E")',
              }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 400, fontStyle: 'italic', mb: 2, position: 'relative', lineHeight: 1.6, maxWidth: 700, mx: 'auto' }}
            >
              &ldquo;Que personne ne méprise ta jeunesse ; mais sois un modèle pour les fidèles,
              en parole, en conduite, en amour, en foi, en pureté.&rdquo;
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.secondary.light, position: 'relative' }}>
              — 1 Timothée 4:12
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
              Nos activités
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Spirituel & sportif, un équilibre pour les jeunes
            </Typography>
          </Stack>

          {/* Spiritual activities */}
          <Typography
            component={m.div}
            variants={varFade('inUp')}
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <MenuBook sx={{ color: 'primary.main' }} /> Activités spirituelles
          </Typography>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {ACTIVITY_SPIRITUAL.map((act, index) => (
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
                  <Box
                    sx={{
                      height: 6,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    }}
                  />
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
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.15)})`,
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
            <EmojiEvents sx={{ color: 'secondary.main' }} /> Activités sportives
          </Typography>
          <Grid container spacing={3}>
            {ACTIVITY_SPORT.map((sport, index) => (
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
              Nos camps
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Des moments inoubliables d&apos;édification
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
              Nos camps sont des temps forts où les jeunes vivent une expérience unique de croissance
              spirituelle, de fraternité et de joie dans un cadre exceptionnel.
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {CAMPS_DATA.map((camp, index) => (
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
                  {/* Top gradient bar */}
                  <Box
                    sx={{
                      height: 8,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  />
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
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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
                            backgroundColor: alpha(theme.palette.primary.main, 0.06),
                            color: theme.palette.primary.main,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
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
              Galerie photos
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Nos moments forts en images
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Revivez les temps forts de notre communauté : louanges, camps, matchs et moments de partage.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {GALLERY_IMAGES.map((img, index) => (
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
                    src={img.src}
                    alt={img.alt}
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
                      background: `linear-gradient(to top, ${alpha(theme.palette.primary.darker, 0.8)}, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                      {img.alt}
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
                    Contact
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1.5 }}>
                    Rejoignez-nous !
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Vous souhaitez en savoir plus sur Tanora A LLB, participer à nos activités ou simplement
                    nous dire bonjour ? N&apos;hésitez pas à nous contacter !
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <Email />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Email
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <Phone />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Téléphone
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <Place />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Adresse
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Antananarivo, Madagascar
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.15) },
                    }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: theme.palette.primary.main,
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.15) },
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
                  Envoyez-nous un message
                </Typography>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Nom" variant="outlined" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Prénom" variant="outlined" />
                    </Grid>
                  </Grid>
                  <TextField fullWidth label="Email" variant="outlined" type="email" />
                  <TextField fullWidth label="Sujet" variant="outlined" />
                  <TextField fullWidth label="Message" variant="outlined" multiline rows={4} />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      px: 5,
                      py: 1.5,
                      fontWeight: 700,
                      borderRadius: 999,
                      alignSelf: 'flex-start',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      transition: 'all 0.25s ease',
                    }}
                  >
                    Envoyer le message
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
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
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: { xs: 2, md: 0 } }}>
                <Church sx={{ fontSize: 32, color: theme.palette.secondary.main }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                    Tanora A LLB
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                    Département Jeunesse • LLB
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), textAlign: { xs: 'left', md: 'center' } }}>
                &ldquo;Car je connais les projets que j&apos;ai formés sur vous, dit l&apos;Éternel,
                projets de paix et non de malheur, afin de vous donner un avenir et de l&apos;espérance.&rdquo;
                <br />
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Jérémie 29:11</strong>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="body2"
                sx={{ color: alpha('#fff', 0.5), textAlign: { xs: 'left', md: 'right' } }}
              >
                © {new Date().getFullYear()} Tanora A LLB. Tous droits réservés.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MotionContainer>
  );
}
