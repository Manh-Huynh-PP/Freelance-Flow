# PowerShell script to deploy and test
Write-Host "=== Deploying Share Link Fix ===" -ForegroundColor Green

# Add all changes
Write-Host "1. Adding files..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "2. Committing changes..." -ForegroundColor Yellow
git commit -m "Migrate Share feature to Supabase Storage"

# Push to GitHub
Write-Host "3. Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "4. Deploy completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel Dashboard -> Project Settings -> Environment Variables"
Write-Host "2. Ensure these variables are set for Production:"
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL"
Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY"
Write-Host ""
Write-Host "3. In Supabase Dashboard -> Storage:"
Write-Host "   - Create a bucket named 'shares' with public access"
Write-Host ""
Write-Host "4. After setting env vars, redeploy or wait for auto-deploy"
Write-Host ""
Write-Host "5. Monitor Vercel function logs for detailed error info"
