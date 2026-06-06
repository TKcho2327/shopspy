import { supabase } from './supabaseClient'

const REWARD_PER_REPORT = 0.10
const MAX_DAILY_REPORTS = 10
const DUPLICATE_LOCK_HOURS = 24

// 오늘 제보 건수 확인
export async function getTodayReportCount(userId) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
  return count || 0
}

// 하루 최대 10건 초과 체크
export async function canReport(userId) {
  const count = await getTodayReportCount(userId)
  return count < MAX_DAILY_REPORTS
}

// 중복 제보 체크 (같은 매장 24시간 이내)
export async function isDuplicate(mallName, brandName) {
  const since = new Date(Date.now() - DUPLICATE_LOCK_HOURS * 60 * 60 * 1000)
  const { data } = await supabase
    .from('posts')
    .select('id, created_at')
    .eq('mall_name', mallName)
    .eq('brand_name', brandName)
    .gte('created_at', since.toISOString())
    .limit(1)
  return data && data.length > 0
}

// $0.10 보상 적립
export async function addReward(userId, amount = REWARD_PER_REPORT) {
  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (wallet) {
    await supabase
      .from('wallets')
      .update({
        balance: wallet.balance + amount,
        total_earned: wallet.total_earned + amount,
      })
      .eq('user_id', userId)
  } else {
    await supabase
      .from('wallets')
      .insert({ user_id: userId, balance: amount, total_earned: amount })
  }
}

// 허위 신고 $0.01 적립
export async function addFlagReward(reporterId) {
  await addReward(reporterId, 0.01)
}