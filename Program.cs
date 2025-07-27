var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register database services
builder.Services.AddSingleton<olshop.Data.IDatabaseConnectionFactory, olshop.Data.DatabaseConnectionFactory>();
builder.Services.AddSingleton<olshop.Data.ISqlQueryProvider, olshop.Data.SqlQueryProvider>();
builder.Services.AddScoped<olshop.Data.IProductRepository, olshop.Data.ProductRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


app.Run();
