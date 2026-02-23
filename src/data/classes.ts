import type { LucideIcon } from 'lucide-react'
import { Languages, Brain, FlaskConical, Palette, Users, Lightbulb } from 'lucide-react'

export type ClassIconType = 'Languages' | 'Brain' | 'FlaskConical' | 'Palette' | 'Users' | 'Lightbulb'

export const CLASS_ICONS: Record<ClassIconType, LucideIcon> = {
  Languages,
  Brain,
  FlaskConical,
  Palette,
  Users,
  Lightbulb,
}

export interface ClassItem {
  name: string
  instructor: string
  icon: ClassIconType
}

export const INITIAL_CLASSES: ClassItem[] = [
  { name: 'Intensive English JI', instructor: 'Sarah Jenkins', icon: 'Languages' },
  { name: '課題アプローチ', instructor: '佐藤 健一', icon: 'Brain' },
  { name: '自然科学総合実験', instructor: 'Dr. Alexander Wright', icon: 'FlaskConical' },
  { name: 'デザイン学基礎', instructor: 'Elena Rodriguez', icon: 'Palette' },
  { name: '哲学対話II', instructor: '本田 宗一郎（仮）', icon: 'Users' },
]

export const NEW_CLASS_ON_ADD: ClassItem = {
  name: 'デザイン思考3',
  instructor: 'パク・チェヨン',
  icon: 'Lightbulb',
}
