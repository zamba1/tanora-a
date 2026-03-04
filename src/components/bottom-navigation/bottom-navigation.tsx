'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Map, Article, MapOutlined, ArticleOutlined } from '@mui/icons-material';

const navigationItems = [
  {
    label: 'Publications',
    path: '/publications',
    icon: ArticleOutlined,
    activeIcon: Article,
  },
  {
    label: 'Ravitaillements',
    path: '/ravitaillements',
    icon: MapOutlined,
    activeIcon: Map,
  },
];

export default function AppBottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(
    navigationItems.findIndex(item => pathname === item.path)
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(navigationItems[newValue].path);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTop: '1px solid',
        borderColor: 'divider'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        {navigationItems.map((item, index) => {
          const IconComponent = value === index ? item.activeIcon : item.icon;
          return (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={<IconComponent />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
